const BaseItem = require("./ItemClass");

/** @extends BaseItem */
class Bag extends BaseItem {
  /**
   *
   * @param { String } displayName - The name to display
   * @param { String } name - The name for the server
   * @param { Number } price - Price of the item
   * @param { Number} rank - Represents rank or era: 0 - Medieval, 1 - Modern, 2 - Contemporary
   * @param { String } id - Ex: "stn_pkx", "cm_ice", "sp_ice", "gm_ice" (gourmet ice)
   * @param { Number } capacity - Allows pkx to cut different types of ice.
   */
  constructor(displayName, name, price, rank, id, capacity) {
    super(displayName, name, price, rank, id);
    if (typeof capacity !== "number")
      throw new Error(
        `The capacity must be a number. Received a ${typeof capacity}`
      );
    if (!Number.isInteger(capacity) || capacity <= 0)
      throw new Error(
        `The capacity must be an integer greater than 0. Received  ${capacity}`
      );
    this.capacity = capacity;
  }

  get equip() {
    return {
      itemId: this.id,
      rank: this.rank,
      capacity: this.capacity,
    };
  }
}

const LeatherBag = new Bag(
  "Leather Bag",
  "leather_bag",
  150,
  0,
  "lthr_bag",
  10
);

const Bags = new Map();

Bags.set(LeatherBag.id, LeatherBag);

module.exports = Bags;
