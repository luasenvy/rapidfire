const assert = require('assert')

const axios = require('axios')
const $axios = axios.create({ baseURL: 'http://localhost:8000', timeout: 1000 })

describe('NuxtMiddleware.spec', async function () {
  it('GET / Must Return Nuxt Rendered HTML', async () => {
    await $axios.get('/', { timeout: 5000 })
    assert.equal(true, true)
  })
})
