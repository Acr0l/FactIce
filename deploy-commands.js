
const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');
const TOKEN = process.env["TOKEN"];
const fs = require('node:fs');
const path = require('path');

const commands = [];
const commandFiles = [];
function throughDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const absolute = path.join(dir, file);
    if (fs.statSync(absolute).isDirectory()) {
      return throughDirectory(absolute);
    } else if (absolute.endsWith("js")) {
      return commandFiles.push(absolute);
    }
  });
}
throughDirectory(__dirname + "/commands");
for (const file of commandFiles) {
  const command = require(`${file}`);
  if (command.data.name) commands.push(command.data.toJSON());
  else console.log(`${file} has no name`);
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
