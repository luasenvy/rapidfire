const Multer = require('multer')

class Controller {
  constructor() {
    this.$rapidfire = null
    this.multer = Multer({ dest: path.join('/tmp', process.env.npm_package_name || '/rapid-fire-uploads/') })
  }
}

module.exports = Controller
