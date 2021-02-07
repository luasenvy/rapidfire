const MongodbService = require('../interfaces/MongodbService')

const { ObjectID } = require('mongodb')

class AccessMongodbService extends MongodbService {
  static collections = ['user']

  /**
   * [constructor description]
   * @param  {[type]} options.collection [description]
   * @param  {[type]} options.bucket     [description]
   * @return {[type]} options.router     [description]
   */
  constructor({ collection, bucket, router }) {
    super({ collection, bucket })

    router.get('/api/users', (req, res, next) => this.findUser(req, res).catch(next))
    router.get('/api/users/:userId', (req, res, next) => this.findOneUser(req, res).catch(next))
    router.post('/api/users', (req, res, next) => this.insertUser(req, res).catch(next))
    router.put('/api/users', (req, res, next) => this.updateUser(req, res).catch(next))
    router.delete('/api/users/:userId', (req, res, next) => this.deleteUser(req, res).catch(next))

    this.router = router
  }

  async findOneUser(req, res) {
    const user = await this.collection.user.findOne({ _id: ObjectID(req.params.userId) })
    if (!user) return res.status(404).end()
    res.send(user)
  }

  async findUser(req, res) {
    const rows = await this.collection.user.find({}).toArray()
    res.send({ rows, total: rows.length })
  }

  async insertUser(req, res) {
    const { name } = req.body
    const { insertedId: createdId } = await this.collection.user.insertOne({ name })
    res.status(201).send({ _id: createdId })
  }

  async updateUser(req, res) {
    const { _id, name } = req.body
    await this.collection.user.updateOne({ _id: ObjectID(_id) }, { $set: { name } })
    res.status(204).end()
  }

  async deleteUser(req, res) {
    await this.collection.user.deleteOne({ _id: ObjectID(req.params.userId) })
    res.status(204).end()
  }
}

module.exports = AccessMongodbService
