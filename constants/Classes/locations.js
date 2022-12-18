const logger = require("../../logger.js");
const BaseClass = require("./BaseClass.js");
const Materials = require("./materials.js");

/** Class representing a location
 * @extends BaseClass
 */
class Location extends BaseClass {
  /**
   * Create a location
   * @param {String} displayName - The name for the user
   * @param {String} name - The name for system and back-end
   * @param {Number} rank - Value to define probabilities and more.
   * @param {Number} lvlReq - The lvl of the user to travel to the location.
   */
  constructor(displayName, name, rank, lvlReq = 0) {
    super(displayName, name);
    this.rank = rank;
    this.materials = [];
    this.lvlReq = lvlReq;
  }
  get lMaterials() {
    return this.materials;
  }
  set lMaterials(materials) {
    const rankLeveler = Math.pow(Math.E, this.rank - 1) - 1;
    const total =
      materials.reduce((a, b) => a.rarity + b.rarity) +
      rankLeveler * materials.length;
    this.materials = materials.map((material) => {
      const fRarity = (total - material.rarity - rankLeveler) / total;
      material.rarity = fRarity;
      return material;
    });
  }
}

const village = new Location("Village", "village", 0);
const smallMountains = new Location("Small Mountains", "small-mountains", 1);
smallMountains.lMaterials = Array.from(Materials.values()).filter((e) =>
  e.locations.includes(smallMountains.name)
);

const Locations = new Map([[village.name, village], [smallMountains.name, smallMountains]])
module.exports = Locations;
