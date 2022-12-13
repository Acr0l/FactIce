const { Events } = require("discord.js");
const logger = require("../logger");
module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    logger.info(`Ready! Logged in as ${client.user?.tag}`);

    client.user?.setActivity("anime (educational purposes).", {
      // @ts-ignore
      type: "WATCHING",
    });
  },
};
