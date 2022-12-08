const { SlashCommandBuilder } = require('@discordjs/builders');
const iceLocations = ["small-mountains"]

const toolEfficiency = {
  stone_pickaxe: 1,
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cut')
		.setDescription('Use your tools to get nice-shaped ice.'),
	async execute(interaction, user) {
		if (user.status !== "idle") 
      return interaction.reply({
        content: "You are already performing another action", 
        ephemeral: true
      });
    if (!iceLocations.includes(user.location))
      return interaction.reply({
        content: "You cannot get ice here!",
        ephemeral: true
      })
    user.status = "cutting";
    await user.save()
    const userToolEfficiency = toolEfficiency[user.inventory.tool] ?? 0, 
      iceReward = (12 + Math.ceil(Math.random() * 7)) * userToolEfficiency,
      toStore = user.spaceLeft - iceReward >= 0 ? iceReward : user.spaceLeft;
    interaction.reply("Cutting...")
    setTimeout(() => {
    user.inventory.storage.stored = [...user.inventory.storage.stored, {name: "ice_cube", quantity: toStore}]
    interaction.followUp(`You cut ${iceReward} ice blocks, and you stored ${toStore}.`)
    }, 3000)
    
    user.status = "idle";
    await user.save()
	},
};
