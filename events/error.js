const { Events } = require('discord.js')

module.exports = {
	name: Events.Error,
	once: false,
	async execute(err) {
		console.error(err);
	},
};