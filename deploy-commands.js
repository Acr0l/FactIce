const { REST, Routes } = require("discord.js"),
  { clientId, guildId } = require("./config.json"),
  { TOKEN } = require("./config.json"),
  fs = require("node:fs"),
  path = require("path"),
  logger = require("./logger"),
  commands = [],
  commandFiles = [];
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
  else logger.info(`${file} has no name`);
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(TOKEN);

// and deploy your commands!
(async () => {
  try {
    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    logger.info(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
