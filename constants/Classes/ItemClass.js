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

  get display() {
    return {
      name: this.displayName,
      value: `**$${this.price}**\nA \`${
        ["Medieval", "Modern", "Contemporary"][this.rank]
      }\` artifact!\nId: \`${this.id}\``,
    };
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

module.exports = BaseItem;
