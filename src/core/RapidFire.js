/* **************************************************************************
 *   ██╗  ███╗   ███╗  ██████╗    ██████╗   ██████╗   ████████╗  ███████╗   *
 *   ██║  ████╗ ████║  ██╔══██╗  ██╔═══██╗  ██╔══██╗  ╚══██╔══╝  ██╔════╝   *
 *   ██║  ██╔████╔██║  ██████╔╝  ██║   ██║  ██████╔╝     ██║     ███████╗   *
 *   ██║  ██║╚██╔╝██║  ██╔═══╝   ██║   ██║  ██╔══██╗     ██║     ╚════██║   *
 *   ██║  ██║ ╚═╝ ██║  ██║       ╚██████╔╝  ██║  ██║     ██║     ███████║   *
 *   ╚═╝  ╚═╝     ╚═╝  ╚═╝        ╚═════╝   ╚═╝  ╚═╝     ╚═╝     ╚══════╝   *
 ************************************************************************** */

const fs = require('fs')
const path = require('path')

const { URL } = require('url')
const qs = require('qs')

const http = require('http')
const https = require('https')

const express = require('express')
const Debug = require('debug')

const bodyParser = require('body-parser')

const EventEmitter = require('events')
const { ServiceLoader, Controller, Middleware } = require('../interfaces')

/* **************************************************************************
 *                  ██╗   ██╗   █████╗   ██████╗   ███████╗                 *
 *                  ██║   ██║  ██╔══██╗  ██╔══██╗  ██╔════╝                 *
 *                  ██║   ██║  ███████║  ██████╔╝  ███████╗                 *
 *                  ╚██╗ ██╔╝  ██╔══██║  ██╔══██╗  ╚════██║                 *
 *                   ╚████╔╝   ██║  ██║  ██║  ██║  ███████║                 *
 *                    ╚═══╝    ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚══════╝                 *
 ************************************************************************** */
const debug = Debug('rapidfire')
const error = Debug('rapidfire:error')
const warn = Debug('rapidfire:warning')

const middlewareEnumTypes = Object.values(Middleware.ENUM.TYPES)

/* **************************************************************************
 *                      ██████╗   ██╗   ██╗  ███╗   ██╗                     *
 *                      ██╔══██╗  ██║   ██║  ████╗  ██║                     *
 *                      ██████╔╝  ██║   ██║  ██╔██╗ ██║                     *
 *                      ██╔══██╗  ██║   ██║  ██║╚██╗██║                     *
 *                      ██║  ██║  ╚██████╔╝  ██║ ╚████║                     *
 *                      ╚═╝  ╚═╝   ╚═════╝   ╚═╝  ╚═══╝                     *
 ************************************************************************** */
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
 * @property  {Array}     tls                  [TLS Connection Options](https://nodejs.org/dist/latest/docs/api/tls.html#tlsconnectoptions-callback)
 * @property  {Array}     bodyParser           [body-parser](https://www.npmjs.com/package/body-parser) "json()" Options
 * @property  {Array}     querystringParser    The Querystring Parameter Value As `Key`. Convert To Datatype And Value As `Value`. e.g.) If You Setted `{ 'null': 0 }`. `/api?b=null` => req.query.b === 0
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
      bodyParser: { limit: '50mb' },
      tls: false, // https://nodejs.org/dist/latest/docs/api/tls.html#tlsconnectoptions-callback
      querystringParser: {
        normalize: {
          '': '',
          true: true,
          false: false,
          null: null,
          undefined,
        },
      },
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
    /**
     * RapidFire Framework Running pre Middleware Instances
     *
     * @member
     * @type {Array}
     */
    this.preMiddlewares = []

    /**
     * RapidFire Framework Running Post Middleware Instances
     *
     * @member
     * @type {Array}
     */
    this.postMiddlewares = []

    /**
     * RapidFire Framework Running Error Handler Middleware Instances
     *
     * @member
     * @type {Array}
     */
    this.errorHandlers = []

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

  async loadModule({ pathname }) {
    return require(pathname)
  }

  async loadControllers() {
    const controllerFilenames = fs.readdirSync(this.options.paths.controllers)

    const controllerPathnames = controllerFilenames
      .flatMap(controllerFilename => this.getModulesRecursively({ parent: this.options.paths.controllers, filename: controllerFilename }))
      .filter(Boolean)

    for (const controllerPathname of controllerPathnames) {
      const Controller = await this.loadModule({ pathname: controllerPathname })
      const controller = new Controller()

      // Register Middleware Default Variables
      controller._$rapidfire = this

      this.controllers.push(controller)
    }

    // Init Controllers
    for (const controller of this.controllers) {
      await controller.init()
      await controller.load()
    }
  }

  async loadServiceLoaders() {
    const loaderFilenames = fs.readdirSync(this.options.paths.loaders)

    const loaderPathnames = loaderFilenames
      .flatMap(loaderFilename => this.getModulesRecursively({ parent: this.options.paths.loaders, filename: loaderFilename }))
      .filter(Boolean)

    for (const loaderPathname of loaderPathnames) {
      const Loader = await this.loadModule({ pathname: loaderPathname })
      const loader = new Loader()

      // Register Middleware Default Variables
      loader._$rapidfire = this

      this.loaders.push(loader)
    }

    // Init Loaders
    for (const loader of this.loaders) {
      await loader.init()
      await loader.load()
    }
  }

  async loadMiddlewares() {
    const middlewareFilenames =
      this.options.middlewares.length <= 0
        ? fs.readdirSync(this.options.paths.middlewares)
        : this.options.middlewares.map(middlewareFilename => (middlewareFilename.endsWith('.js') ? middlewareFilename : `${middlewareFilename}.js`))

    const middlewarePathnames = middlewareFilenames
      .flatMap(middlewareFilename => this.getModulesRecursively({ parent: this.options.paths.middlewares, filename: middlewareFilename }))
      .filter(Boolean)

    // Load Middlewares
    for (const middlewarePathname of middlewarePathnames) {
      const ImplMiddleware = await this.loadModule({ pathname: middlewarePathname })
      const implMiddleware = new ImplMiddleware()

      if (!middlewareEnumTypes.includes(implMiddleware.type)) {
        warn(
          `"${ImplMiddleware.name}" Middleware Type Is Incorrect. Type Must Be One Of ${middlewareEnumTypes
            .map(type => `"${type}"`)
            .join(', ')}. This Middleware Will Setted Default Type "${Middleware.ENUM.TYPES.POST}".`
        )
        implMiddleware.type = Middleware.ENUM.TYPES.POST
      }

      implMiddleware._$rapidfire = this
      implMiddleware._controller = this.controllers.find(controller => controller instanceof ImplMiddleware.controller)

      this.middlewares.push(implMiddleware)

      switch (ImplMiddleware.type) {
        case Middleware.ENUM.TYPES.PRE: {
          this.preMiddlewares.push(implMiddleware)
          break
        }
        case Middleware.ENUM.TYPES.POST: {
          this.postMiddlewares.push(implMiddleware)
          break
        }
        case Middleware.ENUM.TYPES.ERROR: {
          this.errorHandlers.push(implMiddleware)
          break
        }
      }
    }
  }

  async installServices() {
    const serviceFilenames = fs.readdirSync(this.options.paths.services)

    const servicePathnames = serviceFilenames
      .flatMap(serviceFilename => this.getModulesRecursively({ parent: this.options.paths.services, filename: serviceFilename }))
      .filter(Boolean)

    // Load Services
    for (const servicePathname of servicePathnames) {
      const Service = await this.loadModule({ pathname: servicePathname })

      const controller = this.controllers.find(controller => controller instanceof Service.controller)
      const serviceLoader = this.loaders.find(loader => loader instanceof Service.loader)

      const router = express.Router()

      const service = await serviceLoader.getInstance({ router, Service, controller })

      service._$rapidfire = this
      service._controller = controller
      service._router = router

      if (service._router.stack.length) this.express.use(service._router)

      this.services.push(service)
    }

    // Init Services
    for (const service of this.services) {
      await service.init()
      await service.load()
    }
  }

  async installMiddlewares({ middlewares }) {
    for (const middleware of middlewares) {
      await middleware.init()
      await middleware.load()

      for (const { pattern, method, pipe } of middleware.pipelines) {
        if (pipe instanceof Function || Array.isArray(pipe)) {
          const binder = this.express[method] || this.express.use

          if (pattern) binder.call(this.express, pattern, pipe)
          else binder.call(this.express, pipe)
        }
      }
    }
  }

  async installErrorHandlers({ errorHandlers }) {
    for (const errorHandler of errorHandlers) {
      await errorHandler.init()
      await errorHandler.load()

      for (const { pipe } of errorHandler.pipelines) {
        if (pipe instanceof Function || Array.isArray(pipe)) {
          this.express.use(pipe)
        }
      }
    }
  }

  async installQuerystringParser() {
    const qsNormalizeKeywords = this.options.querystringParser.normalize
    this.express.use((req, res, next) => {
      if (req.originalUrl.includes('?')) {
        const { search } = new URL(req.url, `${req.protocol}://${req.hostname}`)

        req.query = qs.parse(search.substr(1), {
          arrayLimit: 10000,
          decoder(str, decoder, charset, type) {
            const value = decoder(str, decoder, charset, type)

            // Data Type Keywords
            //  - true, false, null, undefined
            if (value in qsNormalizeKeywords) return qsNormalizeKeywords[value]

            // Number Type Value
            //  - Must Be Pass 'isNaN()' And Not Zero Padded Digits Or Empty.
            if (!isNaN(value) && !/^(-|\+)?0[0-9]+$/.test(value)) return parseFloat(value)

            // String Value
            return value
          },
        })
      }

      next()
    })
  }

  onListen() {
    debug(`Server listening on http${this.options.tls ? 's' : ''}://${this.options.host}:${this.options.port}`)

    /**
     * Server Is Ready To Listen
     *
     * @event RapidFire#open
     */
    this.emit('open')
    this.isReady = true
  }

  onClose() {
    this.server = null
    debug('Server Closed.')

    /**
     * HttpServer Is Stop To Listen
     *
     * @event RapidFire#close
     */
    this.emit('close')
    this.isReady = false
  }

  /**
   * StartUp RapidFire Framework.
   */
  async ignition() {
    const { isDev } = this.options

    if (isDev) global._$rapidfire = this

    try {
      // ------------------------ Load Contollers
      if (this.options.paths.controllers) await this.loadControllers()

      // ------------------------ Load ServiceLoaders
      if (this.options.paths.loaders) await this.loadServiceLoaders()

      // ------------------------ Built-in Request Pre Middlewares
      // querystring-parser
      this.installQuerystringParser()

      // body-parser
      this.express.use(bodyParser.json(this.options.bodyParser))

      // ------------------------ Load Middlewares
      if (this.options.paths.middlewares) await this.loadMiddlewares()

      // ------------------------ Init Pre Middlewares And Connect Pipelines To Express
      if (this.preMiddlewares.length) await this.installMiddlewares({ middlewares: this.preMiddlewares })

      // ------------------------ Install Controller / Bind Service
      if (this.options.paths.services) await this.installServices()

      // ------------------------ Init Post Middlewares And Connect Pipelines To Express
      if (this.postMiddlewares.length) await this.installMiddlewares({ middlewares: this.postMiddlewares })

      // ------------------------ Init Error Handler Middlewares And Connect Pipelines To Express
      if (this.errorHandlers.length) await this.installErrorHandlers({ errorHandlers: this.errorHandlers })
    } catch (err) {
      error(err)
      throw err
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

    if (this.options.tls) this.server = https.createServer(this.options.tls, this.express)
    else this.server = http.createServer(this.express)

    this.server.on('close', this.onClose)

    this.server.listen(this.options.port, this.options.host, this.onListen)
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

/* **************************************************************************
 *      ██████╗   ███████╗  ████████╗  ██╗   ██╗  ██████╗   ███╗   ██╗      *
 *      ██╔══██╗  ██╔════╝  ╚══██╔══╝  ██║   ██║  ██╔══██╗  ████╗  ██║      *
 *      ██████╔╝  █████╗       ██║     ██║   ██║  ██████╔╝  ██╔██╗ ██║      *
 *      ██╔══██╗  ██╔══╝       ██║     ██║   ██║  ██╔══██╗  ██║╚██╗██║      *
 *      ██║  ██║  ███████╗     ██║     ╚██████╔╝  ██║  ██║  ██║ ╚████║      *
 *      ╚═╝  ╚═╝  ╚══════╝     ╚═╝      ╚═════╝   ╚═╝  ╚═╝  ╚═╝  ╚═══╝      *
 ************************************************************************** */
module.exports = RapidFire
