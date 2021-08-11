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
  /**
   * Controller Class
   *
   * @static
   * @type {Controller}
   */
  static controller = Controller

  static _ENUM = {
    TYPES: {
      PRE: 'pre',
      POST: 'post',
      ERROR: 'error',
    },
  }

  static get ENUM() {
    return this._ENUM
  }

  /** Create Middleware */
  constructor() {
    this._$rapidfire = null
    this._controller = null

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
    /**
     * RapidFire Middleware Is Loaded
     *
     * @event RapidFire#middleware:load
     */
    this.emit('middleware:load', { middleware: this })
  }
}

module.exports = Middleware
