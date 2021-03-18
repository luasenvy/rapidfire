/** @interface */
class ServiceLoader {
  /** Create Service */
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

  /**
   * Service Factory
   *
   * @param {Object} options
   * @param {Express} options.express Express Module
   * @param {Service} options.Service Service Class
   */
  load({ express, Service }) {
    return new Service({ router: express.Router() })
  }
}

module.exports = ServiceLoader
