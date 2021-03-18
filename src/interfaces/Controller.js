const path = require('path')

const Multer = require('multer')

/** @interface */
class Controller {
  /** Create Controller */
  constructor() {
    this._$rapidfire = null
    this._multer = Multer({ dest: path.join('/tmp', process.env.npm_package_name || '/rapid-fire-uploads/') })
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
   * {@link https://github.com/expressjs/multer Multer} Instance
   *
   * @instance
   * @readonly
   * @type {Multer}
   */
  get multer() {
    return this._multer
  }

  async init() {}
}

module.exports = Controller
