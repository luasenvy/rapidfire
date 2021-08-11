const EventEmitter = require('events')

/**
 * @interface
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> ServiceLoader;
 */
class ServiceLoader extends EventEmitter {
  /** Create Service */
  constructor() {
    super()

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

  async load() {
    /**
     * RapidFire ServiceLoader Is Loaded
     *
     * @event RapidFire#serviceLoader:load
     */
    this.emit('serviceLoader:load', { serviceLoader: this })
  }

  /**
   * Service Factory
   *
   * @param {Object} options
   * @param {Express} options.express Express Module
   * @param {Service} options.Service Service Class
   */
  getInstance({ express, Service, controller }) {
    return new Service({ router: express.Router(), controller })
  }
}

module.exports = ServiceLoader
