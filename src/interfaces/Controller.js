const path = require('path')

const Multer = require('multer')

/** @interface */
class Controller {
  /** Create Controller */
  constructor() {
    /**
     * Running RapidFire Instance
     *
     * @type {RapidFire}
     */
    this.$rapidfire = null
    /**
     * {@link https://github.com/expressjs/multer Multer} Instance
     *
     * @type {Multer}
     */
    this.multer = Multer({ dest: path.join('/tmp', process.env.npm_package_name || '/rapid-fire-uploads/') })
  }
}

module.exports = Controller
