const { SlashCommandBuilder } = require("@discordjs/builders");
const Materials = require("../../constants/Classes/materials");
const logger = require("../../logger");
const DELAY = 10000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Offer your fresh ice.")
    .addStringOption((item) =>
      item
        .setName("item")
        .setDescription("The item you want to offer.")
        .setRequired(true)
        .addChoices(
          { name: "Common Ice", value: "cm_i" },
          { name: "Special Ice", value: "sp_i" }
        )
    )
    .addIntegerOption((amount) =>
      amount
        .setName("amount")
        .setDescription("Amount of the item you want to offer.")
        .setRequired(true)
        .setMinValue(1)
    ),
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   * @param {*} user
   * @returns
   */
  async execute(interaction, user) {
    // @ts-ignore
    const itemToSellId = interaction.options.getString("item"),
      // @ts-ignore
      amountToSell = interaction.options.getInteger("amount");
    // #region Returns
    if (user.location !== "village")
      return interaction.reply(
        "You cannot sell ice here!\nTry at the `Village`"
      );
    // #endregion
    user.status = "selling";
    await user.save();
    await interaction.reply("Selling fresh ice...");
    try {
      user.sell = { itemId: itemToSellId, amount: amountToSell };
      setTimeout(async () => {
        // TODO: Add money
        const moneyReceived =
          (Materials.get(itemToSellId)?.itemPrice ?? 0) * amountToSell;
        user.balance += moneyReceived;
        await user.save();
        // TODO: Reply with money received.
        interaction.editReply(
          `You sold \`${amountToSell}\` *${
            Materials.get(itemToSellId)?.displayName ?? "an item"
          }* for \`$${moneyReceived}\``
        );
      }, DELAY);
    } catch (error) {
      interaction.followUp(error.message);
    } finally {
      user.status = "idle";
      await user.save();
    }
  },
};
