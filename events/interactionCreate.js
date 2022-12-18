const { Events } = require("discord.js");
const Profile = require("../models/userModel");
const logger = require("../logger");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   * Event handler, called when a user interacts with the bot.
   * @param {import('discord.js').Interaction} interaction
   * @see {@link https://discord.js.org/#/docs/main/stable/class/Interaction}
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (!interaction.inGuild()) return;
    if (!interaction.isCommand()) return;
    const { guild } = interaction;
    // @ts-ignore
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    let user;
    try {
      user = await getUser({
        interaction,
        guild,
      });
    } catch (err) {
      logger.error(err);
      interaction.reply(err.message);
      return;
    }

    try {
      await command.execute(interaction, user, interaction.client);
    } catch (error) {
      logger.error(error);
      interaction.reply("Error");
      return;
    }
  },
};

async function getUser({ interaction, guild }) {
  const user = await Profile.findOne({
    userId: interaction.user.id,
  });
  if (!user && interaction.commandName !== "tutorial")
    throw new Error(
      "You have not created your profile yet. Please do so by typing `/tutorial`."
    );

  return user;
}
