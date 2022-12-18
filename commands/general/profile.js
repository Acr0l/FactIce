const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Tools = require("../../constants/Classes/tools");
const Locations = require("../../constants/Classes/locations");

const COLOR = "#03045E";
const embedText = {
  title: "Profile",
  description:
    "It was a sizzling afternoon in the Marshmallow Village, your ice being their only sustenance...\nWork hard, young one",
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display your freezing progress."),
  /**
   * Cut
   * @param { import('discord.js').CommandInteraction } interaction - Interaction object, used to reply
   * @param { import('../../models/userModel').User } user - User
   * @returns Nothing 👍
   */
  async execute(interaction, user) {
    const userTool = Tools.get(user.inventory.tool.itemId);
    const embed = new EmbedBuilder()
      .setColor(COLOR)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ extension: "jpg" }),
      })
      .setTitle(embedText.title)
      .setDescription(embedText.description)
      .setThumbnail("https://cdn-icons-png.flaticon.com/512/5906/5906790.png")
      .setFooter({
        text: `You are currently in the ${
          Locations.get(user.location)?.displayName ?? "a faraway place"
        }`,
      })
      .addFields([
        {
          name: "Tool",
          value: `**Name:** ${userTool.displayName}\n**Rank:** ${
            ["Medieval", "Modern", "Contemporary"][userTool.rank]
          }\n**Efficiency:** ${userTool.efficiency}`,
          inline: true,
        },
        {
          name: "Storage",
          value: `**Name:** ${user.inventory.storage.name}\n**Capacity:** ${user.inventory.storage.capacity}\n**Space left:** ${user.spaceLeft}`,
          inline: true,
        },
        { name: "Transport", value: `Not unlocked yet`, inline: false },
        { name: "Balance", value: `**$${user.balance}**`, inline: true },
      ]);

    interaction.reply({ embeds: [embed] });
  },
};
