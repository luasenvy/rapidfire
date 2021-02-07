const fs = require('fs')
const path = require('path')

const consola = require('consola')

const RapidFire = require('../src/index')

const { Logger, MongoClient } = require('mongodb')
const { Client: Elasticsearch } = require('@elastic/elasticsearch')

const constants = {
  isDev: process.env.NODE_ENV !== 'production',
  mocha: {
    timeout: 5 * 1000,
  },
  paths: {
    specs: path.join(__dirname, './specs'),
  },
  dbClients: [],
  elasticsearch: {
    node: 'http://172.30.1.2:9200',
    auth: { username: 'elastic', password: 'elastic' },
  },
  mongodb: {
    uri: 'mongodb://172.30.1.2:27017',
    options: {
      useUnifiedTopology: true,
    },
  },
  rapidFire: {
    options: {
      host: 'localhost',
      port: '8000',
      paths: {
        services: path.join(__dirname, './services'),
        middlewares: path.join(__dirname, './middlewares'),
        loaders: path.join(__dirname, './loaders'),
      },
      querystringParser: {
        normalize: {
          true: true,
          false: false,
          null: null,
          undefined,
        },
      },
    },
  },
}

const fn = {
  gracefulShutdown({ err, eventName }) {
    if (err) console.error(err)
    for (const client of constants.dbClients) {
      if (client && client.close instanceof Function) {
        try {
          console.debug(`[${eventName}] Database Will Be Close.`)
          client.close()
        } catch (err) {
          console.error(err)
        }
      }
    }

    process.exit(0)
  },
  executeSpecsRecursively(specPathnames) {
    for (const specPathname of specPathnames) {
      if (fs.statSync(specPathname).isFile()) {
        require(specPathname)
        continue
      }

      const subSpecPathnames = fs.readdirSync(specPathname).map(specFilename => path.join(specPathname, specFilename))
      fn.executeSpecsRecursively(subSpecPathnames)
    }
  },
}

describe('Rapid Fire Core Engine With Mongodb + Elasticsearch', async function () {
  this.timeout(constants.mocha.timeout)

  before(async function () {
    // Create a new MongoClient
    const mongodbClient = new MongoClient(constants.mongodb.uri, {
      serverSelectionTimeoutMS: constants.mocha.timeout - 1000,
      ...constants.mongodb.options,
    })
    constants.dbClients.push(mongodbClient)

    try {
      // ------------------------ Database Connection
      await mongodbClient.connect()
      consola.ready(`Database Connected To ${constants.mongodb.uri}`)
      Logger.setLevel('info')

      constants.dbClients.push(new Elasticsearch(constants.elasticsearch))
      consola.ready(`Database Connected To ${constants.elasticsearch.node}`)

      constants.rapidFire = new RapidFire({ ...constants.rapidFire.options, isDev: constants.isDev, dbs: constants.dbClients })

      try {
        // 비정상 종료시 자동 close 진행
        process.on('exit', err => fn.gracefulShutdown({ err, eventName: 'exit' }))
        process.on('SIGINT', err => fn.gracefulShutdown({ err, eventName: 'SIGINT' }))
        process.on('SIGTERM', err => fn.gracefulShutdown({ err, eventName: 'SIGTERM' }))
        process.on('uncaughtException', err => fn.gracefulShutdown({ err, eventName: 'uncaughtException' }))
        process.on('SIGKILL', err => fn.gracefulShutdown({ err, eventName: 'SIGKILL' })) // nodemon처럼 SIGKILL 명령에 의해 종료될 때
      } catch (err) {
        // process.on('SIGKILL') 을 사용할 때 uv_signal_start EINVAL 오류가 throws될 수 있음.
        if (err.code !== 'EINVAL') {
          console.error(err)
          return fn.gracefulShutdown({ err, eventName: err.code })
        }
      }

      await constants.rapidFire.ignition()
    } catch (err) {
      for (const client of constants.dbClients) {
        if (client && client.close instanceof Function) {
          try {
            client.close()
          } catch (err) {
            console.error(err)
          }
        }
      }
      console.error(err)
    }
  })

  after(async function () {
    for (const client of constants.dbClients) {
      if (client && client.close instanceof Function) {
        try {
          client.close()
        } catch (err) {
          console.error(err)
        }
      }
    }
    constants.rapidFire.extinguish()
  })

  describe('Middleware Tests', async function () {
    const middlewareSpecPathname = path.join(constants.paths.specs, 'middlewares')
    const specPathnames = fs.readdirSync(middlewareSpecPathname).map(specFilename => path.join(middlewareSpecPathname, specFilename))
    fn.executeSpecsRecursively(specPathnames)
  })

  describe('Mongodb Service Tests', async function () {
    const mongodbServiceSpecPathname = path.join(constants.paths.specs, 'services/MongodbService')
    const specPathnames = fs.readdirSync(mongodbServiceSpecPathname).map(specFilename => path.join(mongodbServiceSpecPathname, specFilename))
    fn.executeSpecsRecursively(specPathnames)
  })

  describe('Elasticsearch Service Tests', async function () {
    const elasticsearchServiceSpecPathname = path.join(constants.paths.specs, 'services/ElasticsearchService')
    const specPathnames = fs.readdirSync(elasticsearchServiceSpecPathname).map(specFilename => path.join(elasticsearchServiceSpecPathname, specFilename))
    fn.executeSpecsRecursively(specPathnames)
  })
})
