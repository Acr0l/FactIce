const { Events } = require("discord.js");
const logger = require("../logger");

module.exports = {
  name: Events.Error,
  once: false,
  async execute(err) {
    logger.error(err);
  },
};
