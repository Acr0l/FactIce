const BaseClass = require("./BaseClass");
/** @constant */ const MULTIPLIER = 1500;

/**
 * Certificate class. Certificates are used to access higher ranked locations.
 * @class
 * @constructor
 * @public
 * @extends BaseClass
 */
class Certificate extends BaseClass {
  /**
   * Initial features to build the certificate.
   * @param { String } displayName - The nice-looking name of the Certificate
   * @param { String } id - The shortened lowercase version of the Certificate
   * @param { String } description - A short but funny sentence encouraging the users to go further.
   * @param { Number } rank - Represents the experience it has
   * @param { {[key: String]: Number} } materialsRequired
   */
  constructor(displayName, id, description, rank, materialsRequired) {
    super(displayName, id);
    /**
     * A short but funny sentence encouraging the users to go further.
     * @type { String }
     * @readonly
     */
    this.description = description;
    /**
     * The price required to buy the damned certification
     * @type { Number }
     * @readonly
     */
    this.price = (rank + 1) * MULTIPLIER;
    /**
     * @type { { [key: String]: Number}}
     * @readonly
     */
    this.materialsRequisite = {};
    for (const material in materialsRequired) {
      this.materialsRequisite[material] = materialsRequired[material];
    }
  }
  /**
   * Used to understand if user can buy certificate
   * @param {import('../../models/userModel').User} user
   * @returns { Boolean }
   */
  ableToBuy(user) {
    if (user.balance < this.price) return false;
    for (const material in this.materialsRequisite) {
      if (!user.inventory.storage.stored.some((e) => e.itemId === material))
        return false;
    }
    return true;
  }
}
