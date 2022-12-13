const BaseClass = require("./BaseClass.js");

class Material extends BaseClass {
  constructor(displayName, name, rarity, locations, type = "common") {
    super(displayName, name)
    this.rarity = rarity;
    this.locations = locations;
    this.type = type;
  }
}

const commonIce = new Material("Common Ice", "common_ice", 1, ["small-mountains", "big-mountains"]),
  specialIce = new Material("Special Ice", "special_ice", 99, ["small-mountains", "big-mountains"], "unique");

const Materials = [commonIce, specialIce];
module.exports = Materials;