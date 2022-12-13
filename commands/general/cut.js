const { SlashCommandBuilder } = require("@discordjs/builders");
const iceLocations = ["small-mountains"];
const Location = require("../../constants/locations.js");
const Materials = require("../../constants/materials.js");

const toolEfficiency = {
  stone_pickaxe: 1,
};
const materials = {
  "small-mountains": {
    common_ice: {
      type: "common",
      probability: 0.99,
    },
    special_ice: {
      type: "unique",
      probability: 0.01,
    },
  },
};
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
    try {
      const currentLocation = Location[user.location];
      const userToolEfficiency = toolEfficiency[user.inventory.tool] ?? 0,
        // @ts-ignore
        rewardTypeIndex = currentLocation.materials.map(
          (e) => e.rarity
        ),
        rewardObj =
          currentLocation.materials[weightedRandom(...rewardTypeIndex)],
        rewardQuantity =
          rewardObj.type == "unique"
            ? 1
            : Math.ceil(12 + Math.random() * 9 *
              userToolEfficiency *
              rewardObj.rarity),
        toStore =
          user.spaceLeft - rewardQuantity > 0
            ? rewardQuantity 
            : user.spaceLeft;
      interaction.reply("Cutting...");
      setTimeout(() => {
        if (
          user.inventory.storage.stored.some((e) => e.name === rewardObj.name)
        ) {
          Object.assign(
            user.inventory.storage.stored.find(
              (e) => e.name === rewardObj.name
            ),
            {
              name: rewardObj.name,
              quantity: user.inventory.storage.stored.find(
                (e) => e.name === rewardObj.name
              ),
            }.quantity + rewardQuantity
          );
        } else {
          user.inventory.storage.stored = [
            ...user.inventory.storage.stored,
            { name: rewardObj.name, quantity: rewardQuantity },
          ];
        }
        user.save();
        interaction.followUp(
          `You cut ${rewardQuantity} blocks of ${rewardObj.displayName}, and you stored ${toStore}.`
        );
      }, 3000);
    } catch (err) {
      console.log(err);
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
