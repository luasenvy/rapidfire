/**
 * @typedef {Object} Pipeline
 * @property {(String|RegExp)} pattern {@link https://expressjs.com/ko/api.html#path-examples ExpressPath}
 * @property {Function} Pipe {@link https://expressjs.com/ko/api.html#middleware-callback-function-examples ExpressMiddlewareCallback}
 */

/** @interface */
class Middleware {
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
     * Position Of Middleware.
     *
     * @type {String}
     * @defualt 'post'
     */
    this.position = 'post'
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
