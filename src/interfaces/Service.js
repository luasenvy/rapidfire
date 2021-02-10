const ServiceLoader = require('./ServiceLoader')
const Controller = require('./Controller')

class Service {
  // Loader
  static loader = ServiceLoader

  // Controller
  static controller = Controller

  constructor() {
    this.$rapidfire = null
    this.controller = null
  }
}

module.exports = Service
