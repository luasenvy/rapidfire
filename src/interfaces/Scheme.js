const path = require('path')

const Service = require('./Service')

/**
 * @interface
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> Service;
 *     Service --> Scheme;
 */
class Scheme extends Service {
  static id = ''

  static crudify = true

  static basepath = ''

  /** Create Scheme */
  constructor({ router }) {
    super()

    const { id, crudify, basepath } = this.constructor

    if (id && crudify) {
      router.get(path.join(basepath, id), (req, res, next) => this.getList(req, res).catch(next))
      router.get(path.join(basepath, id, ':id'), (req, res, next) => this.getObject(req, res).catch(next))
      router.post(path.join(basepath, id), (req, res, next) => this.create(req, res).catch(next))
      router.put(path.join(basepath, id), (req, res, next) => this.update(req, res).catch(next))
      router.delete(path.join(basepath, id, ':id'), (req, res, next) => this.delete(req, res).catch(next))
    }
  }

  get db() {
    return this.$rapidfire.dbs[0]
  }

  async list() {
    return {}
  }
  async object({ id }) {
    return {}
  }
  async create() {
    return {}
  }
  async update() {
    return {}
  }
  async remove({ id }) {
    return {}
  }

  async getList(req, res) {
    return res.json(await this.list())
  }
  async getObject(req, res) {
    const { id } = req.params
    return res.json(await this.object({ id }))
  }
  async create(req, res) {
    const { createdId } = await this.create()

    return res.json({ createdId })
  }
  async update(req, res) {
    await this.update()

    res.sendStatus(204)
  }
  async delete(req, res) {
    const { id } = req.params

    await this.remove({ id })

    return res.json()
  }

  async load() {
    this.isReady = true

    /**
     * RapidFire Scheme Is Loaded
     *
     * @event RapidFire#Scheme:load
     */
    this.emit('scheme:load', { scheme: this })
  }

  on(eventName, callback) {
    if ('scheme:load' === eventName && this.isReady) return callback({ scheme: this })
    return super.on(eventName, callback)
  }
}

module.exports = Scheme
