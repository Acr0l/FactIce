class Base {
  /**
   * Create an object with name
   * @param {String} displayName - The name for the user
   * @param {String} name - The name for system and back-end
   */
  constructor(displayName, name) {
    this.displayName = displayName;
    this.name = name;
  }
}

module.exports = Base;