const BaseItem = require("./ItemClass");

/** @extends BaseItem */
class Transport extends BaseItem {
  /**
   *
   * @param { String } displayName - The name to display
   * @param { String } name - The name for the server
   * @param { Number } price - Price of the item
   * @param { Number} rank - Represents rank or era: 0 - Medieval, 1 - Modern, 2 - Contemporary
   * @param { String } id - Ex: "stn_pkx", "cm_ice", "sp_ice", "gm_ice" (gourmet ice)
   * @param { Number } speed - Allows pkx to cut different types of ice.
   */
  constructor(displayName, name, price, rank, id, speed) {
    super(displayName, name, price, rank, id);
    if (typeof speed !== "number")
      throw new Error(`The speed must be a number. Received a ${typeof speed}`);
    if (!Number.isInteger(speed) || speed <= 0)
      throw new Error(
        `The speed must be an integer greater than 0. Received  ${speed}`
      );
    this.speed = speed;
  }

  get equip() {
    return {
      itemId: this.id,
      rank: this.rank,
      speed: this.speed,
    };
  }
}

const BasicWoodenSled = new Transport(
  "Basic Wooden Sled",
  "basic_wooden_sled",
  600,
  0,
  "bs_wdn_sled",
  10
);

const Transports = new Map();

Transports.set(BasicWoodenSled.id, BasicWoodenSled);

module.exports = Transports;
