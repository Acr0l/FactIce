const logger = require("../../logger.js");
const BaseItem = require("./ItemClass.js");

const BUY_EXTRA = 70;

class Material extends BaseItem {
  /**
   * Amazing description.
   * @param { String } displayName - The name to display
   * @param { String } name - The name for the server
   * @param { Number } price - Price of the item
   * @param { Number} rank - Represents rank or era: 0 - Medieval, 1 - Modern, 2 - Contemporary
   * @param { String } id - Ex: "stn_pkx", "cm_ice", "sp_ice", "gm_ice" (gourmet ice)
   * @param { Number } rarity - Inversely proportional (The higher the number, the more common)
   * @param { String[]} locations
   * @param {String} type
   */
  constructor(
    displayName,
    name,
    price,
    rank,
    id,
    rarity,
    locations,
    type = "common"
  ) {
    super(displayName, name, price, rank, id);
    this.materialRarity = rarity;
    this.locations = locations.every((e) => Material.locations.includes(e))
      ? locations
      : [Material.locations[1]];
    this.type = Material.types.includes(type) ? type : "common";
  }
  static types = ["common", "unique"];
  static locations = ["village", "small-mountains", "big-mountains"];

  get buyPrice() {
    return Math.ceil(this.price * (1 + BUY_EXTRA / 100));
  }

  get displayBuy() {
    return {
      name: this.displayName,
      value: `**$${this.buyPrice}**\nA \`${
        ["Medieval", "Modern", "Contemporary"][this.rank]
      }\` artifact!\nId: \`${this.id}\``,
    };
  }

  get rarity() {
    return this.materialRarity;
  }
  set rarity(e) {
    this.materialRarity = e;
  }
}

const commonIce = new Material("Common Ice", "common_ice", 5, 0, "cm_i", 1, [
    "small-mountains",
    "big-mountains",
  ]),
  specialIce = new Material(
    "Special Ice",
    "special_ice",
    15,
    0,
    "sp_i",
    99,
    ["small-mountains", "big-mountains"],
    "unique"
  );
const Materials = new Map([
  [commonIce.id, commonIce],
  [specialIce.id, specialIce],
]);
module.exports = Materials;
