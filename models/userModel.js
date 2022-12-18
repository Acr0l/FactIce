const mongoose = require("mongoose");

/**
 * @typedef itemModel
 * @property { String } itemId
 * @property { Number } amount
 */

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 1,
    min: [1, "You have to store at least one item."],
  },
});

/**
 * @description Saves this document by inserting a new document into the database if document.isNew is true, or sends an updateOne operation only with the modifications to the database, it does not replace the whole document in the latter case.
 * @typedef { Function } DocSave
 * @example
 * product.sold = Date.now();
 * product = await product.save();
 * @example <caption>If save is successful, the returned promise will fulfill with the document saved.</caption>
 * const newProduct = await product.save();
 * newProduct === product; // true
 * @returns { Promise|undefined|void } Returns undefined if used with callback or a Promise otherwise.
 */

/**
 * @typedef User
 * @property { import('mongoose').Types.ObjectId } id
 * @property { String } userId
 * @property { Number } balance
 * @property { Object } inventory
 * @property { { itemId: String, rank: Number, efficiency: Number } } inventory.tool
 * @property { { itemId: String, capacity: Number, rank: Number, stored: itemModel[] } } inventory.storage
 * @property { String } inventory.transport
 * @property { Map } cooldowns
 * @property { String } location
 * @property { String } status
 * @property { Number } spaceLeft - Getter that returns the space left in the storage
 * @property { itemModel } sell - Virtual that modifies user to subtract items from storage.
 * @property { DocSave } save
 */
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  level: Number,
  balance: {
    type: Number,
    required: true,
    get: (/** @type {number} */ v) => Math.round(v),
    set: (/** @type {number} */ v) => Math.round(v),
    default: 0,
  },
  inventory: {
    tool: {
      itemId: { type: String, required: true },
      rank: { type: Number, required: true },
      efficiency: { type: Number, required: true },
    },
    storage: {
      itemId: { type: String, required: true },
      rank: { type: Number, required: true },
      capacity: {
        type: Number,
        default: 10,
        min: [
          1,
          "The storage must exist, and the {VALUE} doesn't meet the criteria.",
        ],
        required: true,
      },
      stored: {
        type: [itemSchema],
        default: [],
      },
    },
    transport: {
      type: String,
      default: "",
    },
  },
  cooldowns: {
    type: Map,
    of: Date,
    required: true,
    default: new Map(),
  },
  status: {
    type: String,
    enum: ["idle", "moving", "cutting", "selling"],
    default: "idle",
  },
  location: {
    type: String,
    enum: ["village", "small-mountains"],
    default: "village",
  },
});

userSchema.virtual("spaceLeft").get(function () {
  return (
    (this.inventory?.storage?.capacity || 0) -
    (this.inventory?.storage?.stored
      .map((/** @type { itemModel } */ e) => e.amount || 0)
      .reduce((a, b) => a + b, 0) || 0)
  );
});

userSchema
  .virtual("sell")
  .set(function (/** @param {{ itemId: String, amount: Number }} v*/ v) {
    // Getting the id of the item and storing it in itemId
    const { itemId, amount } = v,
      findItem = (e) => e.itemId === itemId,
      itemStock = this.inventory?.storage?.stored.find(findItem) || {
        amount: 0,
      },
      itemIndex = this.inventory?.storage?.stored.findIndex(findItem) ?? -1;
    if (itemIndex === -1 || itemStock?.amount < amount)
      throw new Error("❌ Tried to sell more than what was in storage!");
    else if (itemStock.amount === amount)
      this.inventory?.storage?.stored.splice(itemIndex, 1);
    else if (itemStock.amount > amount)
      Object.assign(itemStock, {
        ...itemStock,
        amount: itemStock.amount - amount,
      });
  });
const Profile = mongoose.model("Profiles", userSchema);

module.exports = Profile;
