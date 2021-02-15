## ServiceLoader

`ServiceLoader` Is Useful When You Want To Change Service Contructor Parameter. And `User Define ServiceLoader` Must Be Place In Rapidfire Configuration `paths.loaders` Path.

```javascript
const {
  Interfaces: { ServiceLoader },
} = require('@luasenvy/rapidfire')

class MyServiceLoader extends ServiceLoader {
  constructor() {
    super()
  }

  // Implement `load` Function. Paramter Is 'express' And 'Service'.
  //   The `Service` Is Delivered To The Set By This Loader.
  //   This Function Is Required.
  load({ express, Service }) {
    // You Can Define AnyThing. But Must Return `Service` Instance.
    return new Service({ some: 'thing', you: 'need', router: express.Router() })
  }
}

module.exports = MyServiceLoader
```

### Set `ServiceLoader`

Just Change `loader` Static Property.

```javascript
const {
  Interfaces: { Service },
} = require('@luasenvy/rapidfire')

const MyServiceLoader = require('../some/your/loaders/path/MyServiceLoader')

class MyService extends Service {
  static loader = MyServiceLoader

  constructor({ some, you, router }) {
    super()

    router.get('/hello', (req, res, next) => this.sayThingNeed(req, res).catch(next))

    // Now, You Can Use Custom Paramters.
    this.thingneed = some + you
  }

  sayThingNeed(req, res) {
    res.send(this.thingneed)
  }
}

module.exports = MyService
```
