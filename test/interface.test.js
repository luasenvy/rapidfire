const fs = require('fs')
const path = require('path')

const axios = require('axios')
const https = require('https')

const tlsCert = fs.readFileSync(path.join(__dirname, './certs/cert.crt'))
const tlsKey = fs.readFileSync(path.join(__dirname, './certs/cert.key'))

const $axios = axios.create({
  baseURL: 'https://localhost:8443',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }), // self signed test
})

const { RapidFire } = require('../src/core')
const MyService = require('./services/MyService')
const MyServiceLoader = require('./loaders/MyServiceLoader')
const MyController = require('./controllers/MyController')

const rapidFire = new RapidFire({
  host: 'localhost',
  port: 8443,
  paths: {
    services: path.join(__dirname, './services'),
    loaders: path.join(__dirname, './loaders'),
    controllers: path.join(__dirname, './controllers'),
    middlewares: path.join(__dirname, './middlewares'),
  },
  tls: { cert: tlsCert, key: tlsKey },
})

describe('unit/interfaces', () => {
  test('"Service" Interface implementation Test', async () => {
    expect(MyService.loader).toEqual(MyServiceLoader)
    expect(MyService.controller).toEqual(MyController)
  })

  test('api call test', done => {
    rapidFire.on('open', async () => {
      try {
        const { data, headers } = await $axios.get('/api/hello')
        console.info(data, headers, '@@@@@@@@@@@@@@@@@')
      } catch (err) {
        console.error(err.response?.data || err.message)
      } finally {
        rapidFire.extinguish()
      }
    })

    rapidFire.on('close', done)

    rapidFire.ignition()
  })
})
