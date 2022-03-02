const { Service } = require('../../src/interfaces')

const MyServiceLoader = require('../loaders/MyServiceLoader')
const MyController = require('../controllers/MyController')

class MyService extends Service {
  static loader = MyServiceLoader

  static controller = MyController

  constructor({ router }) {
    super()

    router.get('/abc', (req, res, next) => this.sayWorld(req, res).catch(next))
    router.get('/api/hello', (req, res, next) => this.sayWorld(req, res).catch(next))
  }

  async init() {
    await super.init()
  }

  async sayWorld(req, res) {
    res.send('world')
  }
}

module.exports = MyService
