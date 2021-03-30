/**
 * @typedef {Object} Pipeline
 * @property {(String|RegExp)} pattern {@link https://expressjs.com/ko/api.html#path-examples ExpressPath}
 * @property {Function} Pipe {@link https://expressjs.com/ko/api.html#middleware-callback-function-examples ExpressMiddlewareCallback}
 */

/** @interface */
class Middleware {
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
   * Initialize Function
   */
  async init() {}
}

module.exports = Middleware
