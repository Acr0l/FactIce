const { SlashCommandBuilder} = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle }  = require('discord.js')
const Profile = require('../../models/userModel');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tutorial')
		.setDescription('Start your freezing journey!'),
	async execute(interaction, userData) {
    
    const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setURL('https://sebastianlorca.com')
				.setLabel('Tutorial')
				.setStyle(ButtonStyle.Link)
				.setEmoji('📖'),
		);
    try {
			profileData = await Profile.findOne({
				userId: interaction.user.id,
			});
			if (!profileData) {
				const profile = await Profile.create({
					userId: interaction.user.id,
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
				}
				);
				return;
			}
		} catch (err) {
			console.info(err);
		}
  }
}