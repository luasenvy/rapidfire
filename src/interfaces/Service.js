const ServiceLoader = require('./ServiceLoader')
const Controller = require('./Controller')

const EventEmitter = require('events')

/**
 * @interface
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> Service;
 */
class Service extends EventEmitter {
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
    super()

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

  async load() {
    /**
     * RapidFire Service Is Loaded
     *
     * @event RapidFire#service:load
     */
    this.emit('service:load', { service: this })
  }
}

module.exports = Service
