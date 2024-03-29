const Controller = require('./Controller')

const EventEmitter = require('events')

/**
 * @typedef {Object} Pipeline
 * @property {(String|RegExp)} pattern {@link https://expressjs.com/ko/api.html#path-examples ExpressPath}
 * @property {Function} Pipe {@link https://expressjs.com/ko/api.html#middleware-callback-function-examples ExpressMiddlewareCallback}
 */

/**
 * @interface
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> Middleware;
 */
class Middleware extends EventEmitter {
  static ENUM = {
    TYPES: {
      PRE: 0,
      POST: 1,
      ERROR: 2,
    },
  }

  /**
   * Middleware Type
   *
   * @static
   * @type {String}
   */
  static type = Middleware.ENUM.TYPES.PRE

  /**
   * Controller Class
   *
   * @static
   * @type {Controller}
   */
  static controller = Controller

  /** Create Middleware */
  constructor() {
    super()

    this._$rapidfire = null
    this._controller = null

    this.isReady = false

    /**
     * Tasks Of Middleware.
     *
     * @type {Pipeline[]}
     */
    this.pipelines = []

    /**
     * Type Of Middleware.
     *
     * @type {String}
     * @defualt 'post'
     */
    this.type = Middleware.ENUM.TYPES.POST
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

  /**
   * Initialize Function
   */
  async init() {}

  async load() {
    this.isReady = true

    /**
     * RapidFire Middleware Is Loaded
     *
     * @event RapidFire#middleware:load
     */
    this.emit('middleware:load', { middleware: this })
  }
}

module.exports = Middleware
