const { SlashCommandBuilder } = require("@discordjs/builders");
const logger = require("../../logger");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Profile = require("../../models/userModel");
const Tools = require("../../constants/Classes/tools");
const Bags = require("../../constants/Classes/bags");

const initialBagId = "lthr_bag";
const initialToolId = "stn_pkx";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tutorial")
    .setDescription("Start your freezing journey!"),
  async execute(interaction, user) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://sebastianlorca.com")
        .setLabel("Tutorial")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📖")
    );
    try {
      user = await Profile.findOne({
        userId: interaction.user.id,
      });
      if (!user) {
        const profile = await Profile.create({
          userId: interaction.user.id,
          inventory: {
            tool: Tools.get(initialToolId).equip,
            storage: Bags.get(initialBagId).equip,
          },
        });

        profile.save();

        await interaction.reply({
          content: `Welcome ${interaction.user.username}, you have successfully registered, click the button to begin the tutorial! (WIP)`,
          components: [row],
        });
        return;
      } else {
        await interaction.reply({
          content: `Don't worry ${interaction.user.username}, you already have an ice company account!\n If you want, you can still use the tutorial by clicking the button below. (WIP)`,
          components: [row],
        });
        return;
      }
    } catch (err) {
      console.info(err);
    }
  },
};
