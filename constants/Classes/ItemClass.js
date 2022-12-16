const BaseClass = require("./BaseClass");

class BaseItem extends BaseClass {
  /**
   *
   * @param { String } displayName - The name to display
   * @param { String } name - The name for the server
   * @param { Number } price - Price of the item
   * @param { Number} rank - Represents rank or era: 0 - Medieval, 1 - Modern, 2 - Contemporary
   * @param { String } id - Ex: "stn_pkx", "cm_ice", "sp_ice", "gm_ice" (gourmet ice)
   */
  constructor(displayName, name, price, rank, id) {
    super(displayName, name);
    this.price = price;
    this.rank = rank;
    this.id = id;
  }

  get itemPrice() {
    return this.price;
  }

  /**
   * Return obj to simplify storing process.
   * @param { Number } a - Amount to return
   * @returns {{itemId: String, amount: Number}} itemToStore
   */
  store(a) {
    return {
      itemId: this.id,
      amount: a,
    };
  }
}

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

const StonePickaxe = new Pickaxe(
  "Stone Pickaxe",
  "stone_pickaxe",
  100,
  0,
  "stn_pkx",
  1
);

const Tools = new Map();

Tools.set(StonePickaxe.id, StonePickaxe);
module.exports = { BaseItem, Tools };
