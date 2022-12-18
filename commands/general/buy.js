const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Tools = require("../../constants/Classes/tools"),
  Bags = require("../../constants/Classes/bags"),
  Materials = require("../../constants/Classes/materials");

const DELAY = 3000;
const COLORS = require("../../constants/colors");
const logger = require("../../logger");

const Items = new Map([...Tools, ...Bags, ...Materials]);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Advertise your fresh ice.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setRequired(true)
        .setDescription("The id of the item you want to buy")
    )
    .addIntegerOption((amount) =>
      amount
        .setName("amount")
        .setRequired(false)
        .setDescription(
          "The amount of the item you want to buy, but be careful, some items are unique."
        )
    ),
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   * @param {import('../../models/userModel').User} user
   * @returns
   */
  async execute(interaction, user) {
    // @ts-ignore
    const itemId = interaction.options.getString("id"),
      // @ts-ignore
      itemAmount = interaction.options.getInteger("amount") ?? 1;
    // #region Filters
    if (user.location !== "village")
      return interaction.reply({
        embeds: [failureEmbed("You must be in the Village to buy items!")],
      });
    if (!itemId) return;
    const itemObject = Items.get(itemId);
    if (!itemObject)
      return interaction.reply({
        embeds: [failureEmbed(`The id \`${itemId}\` was not found.`)],
      });
    if (user.spaceLeft < itemAmount)
      return interaction.reply({
        embeds: [failureEmbed("You don't have enough space...")],
      });
    if (!itemObject.type || (itemObject.type === "unique" && itemAmount !== 1))
      return interaction.reply({
        embeds: [
          failureEmbed(
            `You cannot have more than one *${itemObject.displayName}*!`
          ),
        ],
      });
    if (user.balance < (itemObject.buyPrice ?? itemObject.price) * itemAmount)
      return interaction.reply({
        embeds: [failureEmbed("Insufficient funds.")],
      });
    // #endregion
    try {
      const cost = (itemObject.buyPrice ?? itemObject.price) * itemAmount,
        midTimeEmbed = processingEmbed(itemObject.displayName, itemAmount);
      interaction.reply({
        embeds: [midTimeEmbed],
      });
      setTimeout(() => {
        user.balance -= cost;
        const findItem = (e) => e.itemId === itemObject.id;
        const itemInStorage = user.inventory.storage.stored.find(findItem);
        if (itemInStorage) {
          Object.assign(
            itemInStorage,
            itemObject.store(itemInStorage.amount + itemAmount)
          );
        } else {
          user.inventory.storage.stored = [
            ...user.inventory.storage.stored,
            itemObject.store(itemAmount),
          ];
        }
        interaction.followUp({
          embeds: [successEmbed(itemObject, itemAmount)],
        });
        user.save();
      }, DELAY);
    } catch (err) {
      logger.error(err);
    }
  },
};

/**
 * Easily create function to display any failure to users
 * @param { String } msg - The description of why the cmd failed
 * @returns { import('discord.js').EmbedBuilder }
 */
const failureEmbed = (msg) =>
  new EmbedBuilder()
    .setTitle("Oops! It seems there was a problem here...")
    .setDescription(msg)
    .setColor(COLORS.FAILURE)
    .setFooter({ text: "The command was not carried on" });
/**
 * Easily create function to display any failure to users
 * @param { String } itemDisplayName - The nice-looking name of the item.
 * @param { Number } amount - The quantity purchased by the user.
 * @returns { import('discord.js').EmbedBuilder }
 */
const processingEmbed = (itemDisplayName, amount) =>
  new EmbedBuilder()
    .setTitle("Condensing snowflakes...")
    .setDescription(
      `Please be patient while we transfer the ${itemDisplayName}${
        amount === 1 ? "" : "s"
      } to your account.`
    )
    .setColor(COLORS.QUATERNARY)
    .setFooter({ text: `Please wait ${DELAY / 1000} seconds.` });
/**
 *
 * @param { { displayName: String, buyPrice: ?Number, price: Number}} item
 * @param {*} amount
 * @returns
 */
const successEmbed = (item, amount) =>
  new EmbedBuilder()
    .setTitle("Icy Success!")
    .setDescription(
      `You have successfully acquired ${amount} ${item.displayName} for *$${
        (item.buyPrice ?? item.price) * amount
      }*`
    )
    .setColor(COLORS.TERTIARY)
    .setTimestamp();
