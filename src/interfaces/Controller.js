/** @interface */
class Controller {
  /** Create Controller */
  constructor() {
    this._$rapidfire = null
  }

  /**
   * Running RapidFire Instance
   *
   * @instance
   * @readonly
   * @type {RapidFire}
   */
  get $rapidfire() {
    return this._$rapidfire
  }

  async init() {}
}

module.exports = Controller
