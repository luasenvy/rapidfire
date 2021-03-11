/**
 * @typedef {Object} Pipeline
 * @property {(String|RegExp)} pattern {@link https://expressjs.com/ko/api.html#path-examples ExpressPath}
 * @property {Function} Pipe {@link https://expressjs.com/ko/api.html#middleware-callback-function-examples ExpressMiddlewareCallback}
 */

/** @interface */
class Middleware {
  /** Create Middleware */
  constructor() {
    /**
     * Running RapidFire Instance
     *
     * @type {RapidFire}
     */
    this.$rapidfire = null

    /**
     * Tasks Of Middleware.
     *
     * @type {Pipeline[]}
     */
    this.pipelines = []
  }

  /**
   * Initialize Function
   */
  async init() {}
}

module.exports = Middleware
