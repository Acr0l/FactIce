const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const logger = require("./logger");
const { MONGODB_URI, TOKEN } = require("./config.json"),
  fs = require("fs"),
  mongoose = require("mongoose"),
  path = require("path");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Create a collection for the commands
// @ts-ignore
client.commands = new Collection();
// @ts-ignore
client.subcommands = new Collection();

/**
 * Iterate through the commands directory and add them to the respective collection
 * @param {String} dir The directory to search
 * @param {String[]} [arr] Accumulator for the directories
 * @returns {String[]}
 */
const throughDirectory = (dir, arr = []) => {
  fs.readdirSync(dir).forEach((file) => {
    const absolute = path.join(dir, file);
    if (fs.statSync(absolute).isDirectory()) {
      return throughDirectory(absolute, arr);
    } else if (absolute.endsWith("js")) {
      return arr.push(absolute);
    }
  });
  return arr;
};

const commandFiles = [...throughDirectory(path.join(__dirname, "commands"))];
const subcommandFiles = [
  ...throughDirectory(path.join(__dirname, "subcommands")),
];

for (const file of commandFiles) {
  const command = require(`${file}`),
    splitted = file.split("\\"),
    directory = splitted[splitted.length - 2];
  command["directory"] = directory;
  command.cooldown = command.cooldown || 3;
  // @ts-ignore
  client.commands.set(command.data.name, command);
}

for (const file of subcommandFiles) {
  const subcommand = require(`${file}`);
  const splitted = file.split("\\");
  const directory = splitted[splitted.length - 2];

  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  subcommand["directory"] = directory;
  if (subcommand.data.name) {
    // @ts-ignore
    client.subcommands.set(subcommand.data.name, subcommand);
  } else {
    console.error(`${subcommand} not found`);
  }
}

// Create a collection for the events
/**
 * @type {String[]} eventFiles
 */
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection: ", error);
});

// Connect to MongoDB
mongoose
  .set('strictQuery', false)
  .connect(MONGODB_URI)
  .then(() => logger.info("MongoDB Connected"))
  .catch((err) => console.error(err));

// Login to Discord (token)
client.login(TOKEN);
