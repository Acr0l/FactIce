const { SlashCommandBuilder } = require("@discordjs/builders");
const iceLocations = ["small-mountains"];
const Location = require("../../constants/Classes/locations.js");
const logger = require("../../logger.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cut")
    .setDescription("Use your tools to get nice-shaped ice."),
  /**
   * Cut
   * @param { import('discord.js').CommandInteraction } interaction - Interaction object, used to reply
   * @param { Object } user - User
   * @param { String } user.location - The location of the user.
   * @param { String } user.status - The location of the user.
   * @param { Number } user.spaceLeft - The location of the user.
   * @param { Function } user.save - The location of the user.
   * @param { Object } user.inventory - The location of the user.
   * @returns Nothing 👍
   */
  async execute(interaction, user) {
    // #region Returns
    if (user.status !== "idle") {
      return interaction.reply({
        content: "You are already performing another action",
        ephemeral: true,
      });
    }
    if (!iceLocations.includes(user.location)) {
      return interaction.reply({
        content: "You cannot get ice here!",
        ephemeral: true,
      });
    }
    if (user.spaceLeft <= 0) {
      return interaction.reply("Your storage is full.");
    }
    // #endregion
    user.status = "cutting";
    await user.save();
    const currentLocation = Location.get(user.location) ??
        Location.get("village") ?? { materials: "" },
      userToolEfficiency = user.inventory.tool.efficiency ?? 0,
      // @ts-ignore
      rewardTypeIndex = currentLocation.materials.map((e) => e.rarity),
      rewardTypeObj =
        currentLocation.materials[weightedRandom(...rewardTypeIndex)],
      rewardQuantity = rewardFormula(userToolEfficiency, rewardTypeObj),
      toStore =
        user.spaceLeft - rewardQuantity > 0 ? rewardQuantity : user.spaceLeft;

    // Interact with user.
    interaction.reply("Cutting...");
    try {
      setTimeout(() => {
        const findItem = (e) => e.itemId === rewardTypeObj.id;
        if (user.inventory.storage.stored.some(findItem)) {
          const itemInStorage = user.inventory.storage.stored.find(findItem);
          Object.assign(
            itemInStorage,
            rewardTypeObj.store(itemInStorage.amount + toStore)
          );
        } else {
          user.inventory.storage.stored = [
            ...user.inventory.storage.stored,
            rewardTypeObj.store(toStore),
          ];
        }
        user.save();
        interaction.followUp(
          `You cut ${rewardQuantity} blocks of ${rewardTypeObj.displayName}, and you stored ${toStore}.`
        );
      }, 3000);
    } catch (err) {
      logger.info(err.message);
    } finally {
      user.status = "idle";
      await user.save();
    }
  },
};

/**
 * Choose a random number from a range of possible numbers where each number in the range is given a weight
 * @param  {...Number} pmf - Array of numbers
 * @returns { Number }
 */
function weightedRandom(...pmf) {
  if (pmf.reduce((a, b) => a + b) != 1) return 0;

  const cdf = pmf.map(
    (
      (sum) => (value) =>
        (sum += value)
    )(0)
  );
  const r = Math.random();
  return cdf.filter((e) => r >= e).length;
}

/**
 *
 * @param {Number} userToolEfficiency - The efficiency
 * @param { Object } param1
 * @returns
 */
const rewardFormula = (userToolEfficiency, { rarity, type }) => {
  const BASE_REWARD = 12;
  const RANGE = 9;
  return type === "unique"
    ? 1
    : Math.ceil(
        BASE_REWARD + Math.random() * RANGE * userToolEfficiency * rarity
      );
};
