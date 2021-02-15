## Using Database Connection In RapidFire

`RapidFire` Is Not Care About Database Connection. It Just Provide `dbs` Property.

### So, How?

You Can Use Implement In `ServiceLoader` With `$rapidfire` Property.

For Example, When You Use Some Kind Of `Mongodb Client`.

#### Implement "ServiceLoader"

```javascript
const {
  Interfaces: { ServiceLoader },
} = require('@luasenvy/rapidfire')

const { MongoClient } = require('mongodb')

class MyServiceLoader extends ServiceLoader {
  constructor() {
    super()
  }

  load({ express, Service }) {
    // Find MongoClient.
    //   `$rapidfire` Property Is Setted After `super()` In Contructor.
    const dbClient = this.$rapidfire.dbs.find(db => db instanceof MongoClient)

    // Pass `dbClient` Paramter.
    //   Be Careful. `ServiceLoader` Is Singletone. But `load()` Function Is Called As Many As The Number Of `Services` Using This `ServiceLoader`.
    const db = dbClient.db('database_name')
    return new Service({ db, router: express.Router() })
  }
}

module.exports = MyServiceLoader
```

#### Set "ServiceLoader" And Use "Your Database Connection".

```javascript
const {
  Interfaces: { Service },
} = require('@luasenvy/rapidfire')

const MyServiceLoader = require('../some/your/loaders/path/MyServiceLoader')

class MyService extends Service {
  static loader = MyServiceLoader

  // `db` Will Be `Mongodb Database`
  constructor({ db, router }) {
    super()

    router.get('/hello', (req, res, next) => this.usingDbClient(req, res).catch(next))

    this.collection = db.collection('collection_name')
  }

  async usingDbClient(req, res) {
    const rows = await this.collection.find({}).toArray()
    res.send({ rows })
  }
}

module.exports = MyService
```

### Initialize With "dbs" Property.

```javascript
const rapidFire = new RapidFire({ dbs: [mongodbClient], services: '/path/your/services', loaders: '/path/your/loaders' })
rapidFire.ignition()
```
