const { ServiceLoader } = require('../../src/interfaces')

class MyServiceLoader extends ServiceLoader {
  constructor() {
    super()
  }

  async getInstance({ router, Service: MyService, controller }) {
    const elastic = this.$rapidfire.dbs.find(db => db instanceof Elasticsearch)

    const service = new MyService({ router, controller })

    service._$rapidfire = this.$rapidfire
    service._elastic = elastic

    return service
  }
}

module.exports = MyServiceLoader
