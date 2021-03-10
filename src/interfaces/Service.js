const ServiceLoader = require('./ServiceLoader')
const Controller = require('./Controller')

/** @interface */
class Service {
  /**
   * ServiceLoader Class
   *
   * @static
   * @type {ServiceLoader}
   */
  static loader = ServiceLoader

  /**
   * Controller Class
   *
   * @static
   * @type {Controller}
   */
  static controller = Controller

  /** Create Service */
  constructor() {
    /**
     * Running RapidFire Instance
     *
     * @type {RapidFire}
     */
    this.$rapidfire = null
    /**
     * Controller Instance
     *
     * @type {Controller}
     */
    this.controller = null
  }

  async init() {}
}

module.exports = Service
