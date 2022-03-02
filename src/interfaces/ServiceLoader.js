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
    this.isReady = false
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
    this.isReady = true

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
  getInstance({ router, controller, Service }) {
    return new Service({ router, controller })
  }
}

module.exports = ServiceLoader
