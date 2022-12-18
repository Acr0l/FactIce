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
// const Transports = require("../../constants/Classes/transports");
const logger = require("../../logger");
const { winter: quotes } = require("../../constants/quotes.json");
const COLORS = require("../../constants/colors");

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
  // TODO: transport: {
  //   description: "The ice melts, but not if you are fast enough.",
  //   fields: Array.from(Transports.values()).map((e) => e.display),
  // },
  materials: {
    description: "Never cold enough.",
    fields: Array.from(Materials.values()).map((e) => e.displayBuy),
  },
};

const SELECT_MENU_OPTIONS = [
  {
    label: "Tools",
    description: "Look through our amazing pickaxes and more!",
    value: "tools",
  },
  {
    label: "Bags",
    description: "Look through our amazing bags and more!",
    value: "bags",
  },
  {
    label: "Materials",
    description: "If you ran out of ice, this is your place!",
    value: "materials",
  },
];
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
          { name: "Bags", value: "bags" },
          { name: "Materials", value: "materials" }
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
      .setPlaceholder(capitalize(categoryPicked))
      .addOptions(
        ...SELECT_MENU_OPTIONS.filter((e) => e.value !== categoryPicked)
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({
      embeds: [embedFromCategory(categoryPicked)],
      // @ts-ignore
      components: [row],
    });

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
        const categoryEmbed = embedFromCategory(i.values[0]);
        const cRow = new ActionRowBuilder().addComponents(
          selectMenu
            .setPlaceholder(capitalize(i.values[0]))
            .setOptions(
              ...SELECT_MENU_OPTIONS.filter((e) => e.value !== i.values[0])
            )
        );
        i.update({
          embeds: [categoryEmbed],
          // @ts-ignore
          components: [cRow],
        });
      }
    );
    collector?.on("end", (collected) => {
      interaction.editReply({
        components: [],
      });
    });
  },
};

const embedFromCategory = (cat) => {
  const ans = new EmbedBuilder()
    .setTitle(EMBED_TEXT.category.title(cat))
    .setDescription(EMBED_TEXT[cat].description)
    .setColor(COLORS.SECONDARY)
    .setFooter({ text: EMBED_TEXT.category.footer() });
  cat === "menu" ? "" : ans.setFields(...EMBED_TEXT[cat].fields);
  return ans;
};

/**
 * Returns string with the first char uppercase.
 * @param { String } s - String to capitalize (Like This)
 * @returns { String } Capitalized string
 */
const capitalize = (s) =>
  `${s[0].toUpperCase()}${s.toLowerCase().slice(1, s.length)}`;
