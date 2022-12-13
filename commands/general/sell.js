const { SlashCommandBuilder } = require('@discordjs/builders');

const DELAY = 10000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Advertise your fresh ice.')
    .addStringOption(item => 
      item 
        .setName("item")
        .setDescription("The item you want to offer.")
        .setRequired(true)
        .addChoices(
          { name: "Common Ice", value: "common_ice"},
          { name: "Special Ice", value: "special_ice"}
        )
    )
  .addIntegerOption(amount => 
    amount
      .setName("amount")
      .setDescription("Amount of the item you want to offer.")
      .setRequired(false)
  ),
	async execute(interaction, userData) {
		if (user.location !== "village") 
      return interaction.reply("You cannot sell ice here!\nTry at the `Village`");
    const itemToSell = interaction.options.getString("item"),
      amountToSell = interaction.options.getInteger("amount");
    if (!user.inventory.storage.stored.some(e => e.type === itemToSell && e.quantity >= amountToSell))
      return interaction.reply("You can't offer what you don't have!")
    user.status = "selling";
    user.save();
    setTimeout(() => {
      
    }, DELAY)
	},
};
