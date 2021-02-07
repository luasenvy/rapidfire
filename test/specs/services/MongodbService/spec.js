const assert = require('assert')

const axios = require('axios')
const $axios = axios.create({ baseURL: 'http://localhost:8000', timeout: 1000 })

const constants = {
  user: null,
}

describe('AccessMongodbService.spec', async function () {
  it('GET /api/users Must Return 0', async function () {
    const {
      data: { total, rows },
    } = await $axios.get('/api/users')

    assert.equal(total, 0)
    assert.equal(rows.length, 0)
  })

  it('POST /api/users Username Will Be hello world', async function () {
    const {
      data: { _id },
    } = await $axios.post('/api/users', { name: 'hello world' })

    const {
      data: { name },
    } = await $axios.get(`/api/users/${_id}`)

    constants.user = { _id, name }

    assert.equal(name, 'hello world')
  })

  it('PUT /api/users Username Will be hello world-updated', async function () {
    const { _id, name } = constants.user
    const updateName = `${name}-updated`

    await $axios.put('/api/users', { _id, name: updateName })

    const {
      data: { name: savedName },
    } = await $axios.get(`/api/users/${_id}`)

    assert.equal(updateName, savedName)
  })

  it('DELETE /api/users User Will Delete', async function () {
    await $axios.delete(`/api/users/${constants.user._id}`)

    try {
      await $axios.get(`/api/users/${constants.user._id}`)
    } catch (err) {
      assert.equal(err.response.status, 404)
    }
  })
})
