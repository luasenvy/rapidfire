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

  /**
   * Service Factory
   *
   * @param {Object} options
   * @param {Express} options.express Express Module
   * @param {Service} options.Service Service Class
   */
  load({ express, Service }) {
    const service = new Service({ router: express.Router() })

    service.$rapidfire = this.$rapidfire
    service.controller = this.$rapidfire.controllers.find(controller => controller instanceof Service.controller)

    return service
  }
}

module.exports = ServiceLoader
