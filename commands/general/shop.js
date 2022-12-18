const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const Materials = require("../../constants/Classes/materials");
const Tools = require("../../constants/Classes/tools");
const Bags = require("../../constants/Classes/bags");
const Transports = require("../../constants/Classes/transports");
const logger = require("../../logger");
const { winter: quotes } = require("../../constants/quotes.json");

const EMBED_TEXT = {
  menu: {
    description:
      "Feel free to select a category and look for the awesome products we have to offer!",
  },
  category: {
    title: (/** @type { String } cat */ cat) =>
      `Freezy's Shop - ${
        cat === "menu" ? "Menu" : `${capitalize(cat)} Category`
      }`,
    footer: () => quotes[Math.floor(Math.random() * quotes.length)][0],
  },
  tools: {
    description: "Great aid to boost your icy endeavour.",
    fields: Array.from(Tools.values()).map((e) => e.display),
  },
  bags: {
    description: "The more the merrier it is said.",
    fields: Array.from(Bags.values()).map((e) => e.display),
  },
  transport: {
    description: "The ice melts, but not if you are fast enough.",
    fields: Array.from(Transports.values()).map((e) => e.display),
  },
  ice: {
    description: "When you miss is, it comes.",
    fields: Array.from(Materials.values()).map((e => e.displayBuy))
  }
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Offer your fresh ice.")
    .addStringOption((item) =>
      item
        .setName("category")
        .setDescription("The category you want to shop.")
        .setRequired(false)
        .addChoices(
          { name: "Tools", value: "tools" },
          { name: "Bags", value: "bags" }
        )
    ),
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   * @param {import('../../models/userModel').User} user
   * @returns
   */
  async execute(interaction, user) {
    // Categories: Tools, Bags, Transport, Permits
    // @ts-ignore
    // TODO: Check category selected
    const categoryPicked = interaction.options.getString("category") ?? "menu";
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("shop")
      .setPlaceholder("Menu")
      .addOptions(
        {
          label: "Tools",
          description: "Look through our amazing pickaxes and more!",
          value: "tools",
        },
        {
          label: "Bags",
          description: "Look through our amazing bags and more!",
          value: "bags",
        }
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({
      embeds: [embedFromCategory(categoryPicked)],
      // @ts-ignore
      components: [row],
    });

    /**
     * @param {import('discord.js').UserSelectMenuInteraction} i
     * @param {import('discord.js').UserSelectMenuInteraction} i
     * @returns { Boolean } True or false
     */
    const filter = (i) => i.customId === "shop";

    const collector = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 15000,
    });

    collector?.on(
      "collect",
      /** @param {import('discord.js').StringSelectMenuInteraction} i */ (
        i
      ) => {
        if (i.user.id !== interaction.user.id) {
          i.reply({
            ephemeral: true,
            content:
              "Other user invoked the command, you cannot interact with it!",
          });
          return;
        } else if (i.customId !== "shop") return;
        const categoryEmbed = new EmbedBuilder()
          .setTitle(EMBED_TEXT.category.title("Tools"))
          .setFooter({ text: EMBED_TEXT.category.footer() });

        i.update({
          embeds: [categoryEmbed],
          // @ts-ignore
          components: [row],
        });
      }
    );
    collector?.on("end", (collected) => {
      logger.info("Ready");
    });
  },
};

const embedFromCategory = (cat) => {
  const ans = new EmbedBuilder()
    .setTitle(EMBED_TEXT.category.title(cat))
    .setDescription(EMBED_TEXT[cat].description)
    .setFooter({ text: EMBED_TEXT.category.footer() });
  cat === "menu" ? "" : ans.setFields(...EMBED_TEXT[cat].fields);
  logger.info(EMBED_TEXT[cat].fields);
  return ans;
};

/**
 * Returns string with the first char uppercase.
 * @param { String } s - String to capitalize (Like This)
 * @returns { String } Capitalized string
 */
const capitalize = (s) =>
  `${s[0].toUpperCase()}${s.toLowerCase().slice(1, s.length)}`;
