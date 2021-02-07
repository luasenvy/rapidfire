const {
  Interfaces: { ServiceLoader },
} = require('../../src')

const { Client: Elasticsearch } = require('@elastic/elasticsearch')

class ElasticsearchServiceLoader extends ServiceLoader {
  constructor() {
    super()
  }

  load({ dbs, express, Service: ElasticsearchService }) {
    const db = dbs.find(db => db instanceof Elasticsearch)

    const service = new ElasticsearchService({ router: express.Router() })
    service.db = db
    return service
  }
}

module.exports = ElasticsearchServiceLoader
