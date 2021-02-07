const assert = require('assert')

const axios = require('axios')
const $axios = axios.create({ baseURL: 'http://localhost:8000', timeout: 1000 })

const constants = {
  user: null,
}

describe('AccessElasticsearchService.spec', async function () {
  it('GET /api/elasticsearch/users Must Return 0', async function () {
    const {
      data: { total, rows },
    } = await $axios.get('/api/elasticsearch/users')

    assert.equal(total, 0)
    assert.equal(rows.length, 0)
  })
})
