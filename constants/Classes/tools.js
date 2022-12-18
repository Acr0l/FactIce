const BaseItem = require("./ItemClass");

/** @extends BaseItem */
class Pickaxe extends BaseItem {
  /**
   *
   * @param { String } displayName - The name to display
   * @param { String } name - The name for the server
   * @param { Number } price - Price of the item
   * @param { Number} rank - Represents rank or era: 0 - Medieval, 1 - Modern, 2 - Contemporary
   * @param { String } id - Ex: "stn_pkx", "cm_ice", "sp_ice", "gm_ice" (gourmet ice)
   * @param { Number } efficiency - Allows pkx to cut different types of ice.
   */
  constructor(displayName, name, price, rank, id, efficiency) {
    super(displayName, name, price, rank, id);
    this.efficiency = efficiency;
  }

  get equip() {
    return {
      itemId: this.id,
      rank: this.rank,
      efficiency: this.efficiency,
    };
  }
}

const WoodenPickaxe = new Pickaxe(
  "Wooden Pickaxe",
  "wooden_pickaxe",
  0,
  0,
  "wdn_pkx",
  1
);
const StonePickaxe = new Pickaxe(
  "Stone Pickaxe",
  "stone_pickaxe",
  100,
  0,
  "stn_pkx",
  3
);

const Tools = new Map();

Tools.set(WoodenPickaxe.id, WoodenPickaxe);
Tools.set(StonePickaxe.id, StonePickaxe);

module.exports = Tools;
