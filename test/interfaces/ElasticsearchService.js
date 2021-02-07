const Service = require('../../src/interfaces/Service')
const ElasticsearchServiceLoader = require('../loaders/ElasticsearchServiceLoader')

class ElasticsearchService extends Service {
  // loader
  static loader = ElasticsearchServiceLoader

  constructor() {
    super()
  }

  get elastic() {
    return this._db
  }

  set elastic(elastic) {
    this._db = elastic
  }
}

module.exports = ElasticsearchService
