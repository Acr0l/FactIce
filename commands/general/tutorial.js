const { SlashCommandBuilder } = require("@discordjs/builders");
const logger = require("../../logger");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Profile = require("../../models/userModel");
const Tools = require("../../constants/Classes/tools");
const Bags = require("../../constants/Classes/bags");
const { successEmbed } = require("../../util/replyEmbeds");

const initialBagId = "lthr_bag";
const initialToolId = "wdn_pkx";

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
          embeds: [
            successEmbed({
              description: `Welcome ${interaction.user.username}, you have successfully registered!`,
            }),
          ],
          // components: [row],
        });
        const nextSteps = successEmbed({
          title: "Next Steps...",
          description:
            "You are now an ice cutter ❄, and you can find ice by `walk`ing to the `Small Mountains` 🏔 and `cut`ing the ice ⛸, from there, your journey to the Ice Revolution has just begun!\nCheck your stats 🧮 by using `/profile`.",
        });
        await interaction.followUp({ embeds: [nextSteps] });
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
