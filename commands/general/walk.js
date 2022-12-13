const { SlashCommandBuilder } = require('@discordjs/builders');
const DELAY = 5000

module.exports = {
	data: new SlashCommandBuilder()
		.setName('walk')
		.setDescription('Move your character to other places.')
	  .addStringOption(target => 
      target
        .setName("location")
        .setDescription("Place to go")
        .setRequired(true)
        .addChoices(
          {name: "Village", value:"village"},
          {name: "Small Mountains", value:"small-mountains"}
        )
    ),
	async execute(interaction, user) {
		if (user.status !== "idle") 
      return interaction.reply({
        content: "You are already performing another action", 
        ephemeral: true
      });

    const target = interaction.options.getString("location")
    if (user.location === target) return interaction.reply("You are already there!");
    user.status = "moving"
    user.save();
    await interaction.reply(`On your way to \`${target}\`\nIt will take ${DELAY/1000} seconds to get there!`);
    setTimeout( () => {
      interaction.followUp(`You are now in the \`${target}\``);
      user.status = "idle"  
      user.location = target
      user.save();
    }, DELAY)
	},
};
