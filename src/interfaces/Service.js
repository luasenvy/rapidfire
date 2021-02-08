const path = require('path')
const Multer = require('multer')

const Controller = require('./Controller')
const ServiceLoader = require('./ServiceLoader')

const multer = Multer({ dest: path.join('/tmp', process.env.npm_package_name || '/rapid-fire-uploads/') })

const controller = new Controller({ multer })

class Service {
  // Loader
  static loader = ServiceLoader

  // Controller
  static controller = controller

  constructor() {
    this._rapidfire = null
  }

  get $rapidfire() {
    return this._rapidfire
  }
  set $rapidfire($rapidfire) {
    this._rapidfire = $rapidfire
  }
}

module.exports = Service
