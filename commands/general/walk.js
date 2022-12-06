const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('walk')
		.setDescription('Move your character to other places.')
	  .addStringOption(target => 
      target
        .setName("location")
        .setDescription("Place to go")
        .setRequired(true)
    ),
	async execute(interaction, user) {
		if (user.status !== "idle") 
      return interaction.reply({
        content: "You are already performing another action", 
        ephemeral: true
      });

    const target = interaction.options.getString("location")
    user.status = "moving"
    await interaction.reply("You want to go to " + target);
    console.log(user)
	},
};
