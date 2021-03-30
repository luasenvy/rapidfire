const fs = require('fs')
const path = require('path')

const { URL } = require('url')
const qs = require('qs')

const express = require('express')
const debug = require('debug')('rapidfire')
const error = require('debug')('rapidfire:error')
const warn = require('debug')('rapidfire:warning')

const bodyParser = require('body-parser')

const EventEmitter = require('events')
const { ServiceLoader, Controller, Middleware } = require('../interfaces')

const middlewareEnumTypes = Object.values(Middleware.ENUM.TYPES)

/**
 * @typedef   {Object}    RapidFireOptions
 * @property  {Array}     isDev                RapidFire Development Mode
 * @property  {Array}     dbs                  DB Clients
 * @property  {Object}    paths                RapidFire Paths
 * @property  {String}    paths.controllers    RapidFire User Define Controllers Path
 * @property  {String}    paths.services       RapidFire User Define Services Path
 * @property  {String}    paths.middlewares    RapidFire User Define Middlewares Path
 * @property  {String}    paths.loaders        RapidFire User Define Loaders Path
 * @property  {Array}     middlewares          RapidFire Ordered Middleware Filenames In `options.paths.middlewares`
 * @property  {Array}     services             RapidFire Ordered Service Filenames In `options.paths.services`
 */

/**
 * @typedef   {Object}    RapidFireExtinguishOptions
 * @property  {Boolean}   destory              When 'true' This Option, Clear DB Connections With 'close()'. And Reset `this.dbs`, `this.app` Variable.
 */

/**
 * @class
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> RapidFire;
 */
class RapidFire extends EventEmitter {
  /**
   * RapidFire Default Options
   *
   * @static
   * @type     {Object}
   * @property {RapidFireOptions}     options      RapidFire Framework Default Constructor Options
   */
  static defaults = {
    options: {
      dbs: [],
      isDev: process.env.NODE_ENV !== 'production',
      paths: {
        controllers: '',
        services: '',
        middlewares: '',
        loaders: '',
      },
      middlewares: [],
      services: [],
      querystringParser: {
        normalize: {
          true: true,
          false: false,
          null: null,
          undefined,
        },
      },
      app: {},
    },
  }

  /**
   * Create RapidFire Framework
   *
   * @param  {RapidFireOptions}
   */
  constructor({ dbs = [], app = {}, ...options } = {}) {
    super()

    let customOptions = {}

    if (typeof options === 'string') customOptions = require(path.join(__dirname, options))
    else customOptions = options

    /**
     * RapidFire Framework Running Options
     *
     * @member
     * @type     {Object}
     * @property {RapidFireOptions}     options      RapidFire Framework Running Environment
     */
    this.options = {
      ...RapidFire.defaults.options,
      ...customOptions,
    }

    /**
     * RapidFire Framework Running Environments.
     * This Options Is Not Configurable. Only Depends System Environments.
     *
     * @member
     * @type     {Object}
     * @property {Object}     paths         System Paths
     * @property {Object}     paths.root    Current Working Directory
     */
    this.env = {
      paths: {
        root: process.env.PWD,
      },
    }

    /**
     * {@link https://nodejs.org/api/http.html#http_class_http_server HttpServer}
     *
     * @member
     * @type {HttpServer}
     */
    this.server = null

    /**
     * DB Clients
     *
     * @member
     * @type {Array}
     */
    this.dbs = dbs

    /**
     * {@link https://expressjs.com/ko/api.html#app HttpServer}
     *
     * @member
     * @type {ExpressApplicationInstance}
     */
    this.express = express()

    const defaultController = new Controller()
    defaultController._$rapidfire = this
    /**
     * RapidFire Framework Running Controller Instances
     *
     * @member
     * @type {Array}
     */
    this.controllers = [defaultController]

    /**
     * RapidFire Framework Running Service Instances
     *
     * @member
     * @type {Array}
     */
    this.services = []

    /**
     * RapidFire Framework Running Middleware Instances
     *
     * @member
     * @type {Array}
     */
    this.middlewares = []

    const defaultServiceLoader = new ServiceLoader()
    defaultServiceLoader._$rapidfire = this
    defaultServiceLoader._controller = defaultController
    /**
     * RapidFire Framework Running ServiceLoader Instances
     *
     * @member
     * @type {Array}
     */
    this.loaders = [defaultServiceLoader]

    /**
     * Framework App Variables.
     *
     * @member
     * @type {Object}
     */
    this.app = app

    /**
     * Server Ready Status. This Property Is It Changes To 'true' After Emit 'open'.
     *
     * @member
     * @type {Boolean}
     */
    this.isReady = false
  }

  /**
   * StartUp RapidFire Framework.
   */
  async ignition() {
    const { isDev } = this.options

    if (isDev) global._$rapidfire = this

    // ------------------------ Load Contollers
    if (this.options.paths.controllers) {
      const controllerFilenames = fs.readdirSync(this.options.paths.controllers)

      const controllerPathnames = controllerFilenames
        .flatMap(controllerFilename => this.getModulesRecursively({ parent: this.options.paths.controllers, filename: controllerFilename }))
        .filter(Boolean)

      for (const controllerPathname of controllerPathnames) {
        const Controller = require(controllerPathname)
        const controller = new Controller()

        // Register Middleware Default Variables
        controller._$rapidfire = this

        this.controllers.push(controller)
      }

      // Init Controllers
      for (const controller of this.controllers) await controller.init()
    }

    // ------------------------ Load Loaders
    if (this.options.paths.loaders) {
      const loaderFilenames = fs.readdirSync(this.options.paths.loaders)

      const loaderPathnames = loaderFilenames
        .flatMap(loaderFilename => this.getModulesRecursively({ parent: this.options.paths.loaders, filename: loaderFilename }))
        .filter(Boolean)

      for (const loaderPathname of loaderPathnames) {
        const Loader = require(loaderPathname)
        const loader = new Loader()

        // Register Middleware Default Variables
        loader._$rapidfire = this

        this.loaders.push(loader)
      }

      // Init Loaders
      for (const loader of this.loaders) await loader.init()
    }

    // ------------------------ Built-in Request Pre Middlewares
    const qsNormalizeKeywords = this.options.querystringParser.normalize
    this.express.use((req, res, next) => {
      if (req.originalUrl.includes('?')) {
        const { search } = new URL(req.url, `${req.protocol}://${req.hostname}`)

        req.query = qs.parse(search.substr(1), {
          arrayLimit: 10000,
          decoder(str, decoder, charset, type) {
            const value = decoder(str, decoder, charset, type)

            if (/^(\d+|\d*\.\d+)$/.test(value)) return parseFloat(value)
            if (value in qsNormalizeKeywords) return qsNormalizeKeywords[value]
            return value
          },
        })
      }

      next()
    })

    this.express.use(bodyParser.json())

    // ------------------------ Load Middlewares
    if (this.options.paths.middlewares) {
      const middlewareFilenames = this.options.middlewares.length <= 0 ? fs.readdirSync(this.options.paths.middlewares) : this.options.middlewares

      const middlewarePathnames = middlewareFilenames
        .flatMap(middlewareFilename => this.getModulesRecursively({ parent: this.options.paths.middlewares, filename: middlewareFilename }))
        .filter(Boolean)

      // Load Middlewares
      for (const middlewarePathname of middlewarePathnames) {
        const ImplMiddleware = require(middlewarePathname)
        const implMiddleware = new ImplMiddleware()

        if (!middlewareEnumTypes.includes(implMiddleware.type)) {
          warn(
            `"${Middleware.name}" Middleware Type Is Incorrect. Type Must Be One Of ${middlewareEnumTypes.join(
              ','
            )}. This Middleware Will Setted Default Type "${Middleware.ENUM.TYPES.POST}".`
          )
          implMiddleware.type = Middleware.ENUM.TYPES.POST
        }

        implMiddleware._$rapidfire = this
        this.middlewares.push(implMiddleware)
      }
    }

    // ------------------------ Init Pre Middlewares And Connect Pipelines To Express
    for (const middleware of this.middlewares.filter(({ type }) => type === Middleware.ENUM.TYPES.PRE)) {
      await middleware.init()

      for (const { pattern, method, pipe } of middleware.pipelines) {
        if (pipe instanceof Function || Array.isArray(pipe)) {
          const binder = this.express[method] || this.express.use

          if (pattern) binder.call(this.express, pattern, pipe)
          else binder.call(this.express, pipe)
        }
      }
    }

    // ------------------------ Install Controller / Bind Service
    if (this.options.paths.services) {
      const serviceFilenames = fs.readdirSync(this.options.paths.services)

      const servicePathnames = serviceFilenames
        .flatMap(serviceFilename => this.getModulesRecursively({ parent: this.options.paths.services, filename: serviceFilename }))
        .filter(Boolean)

      // Load Services
      for (const servicePathname of servicePathnames) {
        const Service = require(servicePathname)

        const serviceLoader = this.loaders.find(loader => loader instanceof Service.loader)
        const service = await serviceLoader.load({ express, Service })

        service._$rapidfire = this
        service._controller = this.controllers.find(controller => controller instanceof Service.controller)

        if (service.router) this.express.use(service.router)

        this.services.push(service)
      }

      // Init Services
      for (const service of this.services) await service.init()
    }

    // ------------------------ Init Post Middlewares And Connect Pipelines To Express
    for (const middleware of this.middlewares.filter(({ type }) => type === Middleware.ENUM.TYPES.POST)) {
      await middleware.init()

      for (const { pattern, method, pipe } of middleware.pipelines) {
        if (pipe instanceof Function || Array.isArray(pipe)) {
          const binder = this.express[method] || this.express.use

          if (pattern) binder.call(this.express, pattern, pipe)
          else binder.call(this.express, pipe)
        }
      }
    }

    // ------------------------ Init Error Handler Middlewares And Connect Pipelines To Express
    for (const middleware of this.middlewares.filter(({ type }) => type === Middleware.ENUM.TYPES.ERROR)) {
      await middleware.init()

      for (const { pipe } of middleware.pipelines) {
        if (pipe instanceof Function || Array.isArray(pipe)) {
          this.express.use(pipe)
        }
      }
    }

    // eslint-disable-next-line no-unused-vars
    this.express.use((err, req, res, next) => {
      error(err)

      /**
       * Request Has Something Wrong.
       *
       * @event RapidFire#request:error
       */
      this.emit('request:error', err)

      if (res.headersSent) return next(err)

      res.status(err.code || 500).send(err.message)
    })

    this.server = this.express.listen(this.options.port, this.options.host, () => {
      debug(`Server listening on http://${this.options.host}:${this.options.port}`)

      /**
       * HttpServer Is Ready To Listen
       *
       * @event RapidFire#open
       */
      this.emit('open')
      this.isReady = true
    })

    this.server.on('close', () => {
      this.server = null
      debug('Server Closed.')

      /**
       * HttpServer Is Stop To Listen
       *
       * @event RapidFire#close
       */
      this.emit('close')
      this.isReady = false
    })
  }

  /**
   * Extinguish RapidFire Framework.
   *
   * @param {RapidFireExtinguishOptions} options Extinguish Options
   */
  extinguish({ destroy = false } = {}) {
    if (destroy) {
      for (const client of this.dbs) {
        if (client && client.close instanceof Function) {
          try {
            client.close()
          } catch (err) {
            debug(err)
          }
        }
      }

      this.dbs = []
      this.app = {}
    }

    this.controllers = this.controllers.filter(controller => controller instanceof Controller)
    this.services = []
    this.middlewares = []
    this.loaders = this.loaders.filter(loader => loader instanceof ServiceLoader)

    if (this.server) this.server.close()
    this.express = express()
    this.server = null
  }

  /**
   * 하위 디렉토리 포함 .js 로 끝나는 모든 파일 경로
   *
   * @private
   *
   * @param  {Object} options
   * @param  {String} options.parent     부모 경로
   * @param  {String} options.filename   파일명
   *
   * @return {Array} 모든 파일 경로
   */
  getModulesRecursively({ parent, filename }) {
    const filepath = path.join(parent, filename)

    if (fs.statSync(filepath).isFile()) {
      if (filename.endsWith('.js')) return filepath
      return
    }

    return fs.readdirSync(filepath).flatMap(filename => this.getModulesRecursively({ parent: filepath, filename }))
  }
}

module.exports = RapidFire
