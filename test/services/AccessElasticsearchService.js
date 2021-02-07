const ElasticsearchService = require('../interfaces/ElasticsearchService')

class AccessElasticsearchService extends ElasticsearchService {
  /**
   * [constructor description]
   * @param  {[type]} options.collection [description]
   * @param  {[type]} options.bucket     [description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()

    router.get('/api/elasticsearch/users', (req, res, next) => this.searchUser(req, res).catch(next))

    this.router = router
  }

  async searchUser(req, res) {
    const elasticQuery = {
      match_all: {},
    }

    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: 'rapid-fire-user',
      body: {
        query: elasticQuery,
      },
    })

    const {
      body: { count: total },
    } = await this.elastic.count({
      index: 'rapid-fire-user',
      body: {
        query: elasticQuery,
      },
    })

    res.send({ rows, total })
  }
}

module.exports = AccessElasticsearchService
