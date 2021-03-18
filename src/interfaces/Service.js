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
    this._$rapidfire = null
    this._controller = null
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

  /**
   * Controller Instance
   *
   * @instance
   * @readonly
   * @type {Controller}
   */
  get controller() {
    return this._controller
  }

  async init() {}
}

module.exports = Service
