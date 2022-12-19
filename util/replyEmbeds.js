const { EmbedBuilder } = require("discord.js");
const COLORS = require("../constants/colors");

/**
 * Easily create function to display any failure to users
 * @param { String } description - The description of why the cmd failed
 * @param { String } [title] - The description of why the cmd failed
 * @returns { import('discord.js').EmbedBuilder }
 */
module.exports.failureEmbed = (
  description,
  title = "Oops! 🌨 It seems there was a problem here... 🌨"
) =>
  new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(COLORS.FAILURE)
    .setFooter({ text: "The command was not carried on" });
/**
 * Easily create function to display any failure to users
 * @param { Object } param0 - The nice-looking name of the item.
 * @param { Number } [param0.delay = 1000] - Milliseconds taken to success.
 * @param { String } [param0.title = "Condensing snowflakes..."] - The intended title of the processing embed.
 * @param { String } param0.description - The intended description of the processing embed.
 * @param { {[key: String]: String|Number} } [param0.options] - Additional features to add to the description/fields.
 * @returns { import('discord.js').EmbedBuilder }
 */
module.exports.midwayEmbed = ({
  delay = 1000,
  title = "🏔 Condensing snowflakes...",
  description,
  options,
}) => {
  const fields = [];
  for (const option in options) {
    fields.push({ name: option, value: `${options[option]}` });
  }
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(COLORS.QUATERNARY)
    .setFields(fields)
    .setFooter({ text: `Please wait ${delay / 1000} seconds.` });
};
/**
 *
 * @param { Object } param0
 * @param { Object } [param0.options]
 * @param { String } [param0.title]
 * @param { String } param0.description
 * @returns
 */
module.exports.successEmbed = ({
  options,
  title = "❄Icy Success❄",
  description,
}) =>
  new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(COLORS.TERTIARY)
    .setTimestamp();
