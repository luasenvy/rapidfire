const EventEmitter = require('events')

/**
 * @interface
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> Controller;
 */
class Controller extends EventEmitter {
  /** Create Controller */
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
     * RapidFire Middleware Is Loaded
     *
     * @event RapidFire#controller:load
     */
    this.emit('controller:load', { controller: this })
  }
}

module.exports = Controller
