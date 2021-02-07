const Service = require('../../src/interfaces/Service')
const MongodbServiceLoader = require('../loaders/MongodbServiceLoader')

class MongodbService extends Service {
  // loader
  static loader = MongodbServiceLoader

  // Data Store
  static collections = []
  static buckets = []

  /**
   * [constructor description]
   * @param  {[type]} options.collection [description]
   * @param  {[type]} options.bucket     [description]
   */
  constructor({ collection, bucket }) {
    super()

    this.collection = collection
    this.bucket = bucket
  }
}

module.exports = MongodbService
