/** @interface */
class ServiceLoader {
  /** Create Service */
  constructor() {
    /**
     * Running RapidFire Instance
     *
     * @type {RapidFire}
     */
    this.$rapidfire = null
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
