const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('store')
		.setDescription('Advertise your fresh ice.'),
	async execute(interaction, userData) {
		interaction.reply("Hi");
	},
};
