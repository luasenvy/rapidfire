## Controller

Controller Is Util Of Service. You Can Implement Anything:

```javascript
const {
  Interfaces: { Controller },
} = require('@luasenvy/rapidfire')

class MyController extends Controller {
  cunstructor() {
    super()
  }

  sendFile(res) {
    res.sendFile('/something/file')
  }
}

module.exports = MyController
```

## Service

You Can Mapping `URI` And `Function`.

```javascript
const {
  Interfaces: { Service },
} = require('@luasenvy/rapidfire')

class MyService extends Service {
  constructor({ router }) {
    super()

    // Mapping With URI Via `router` Parameter.
    router.get('/hello', (req, res, next) => this.sayWorld(req, res).catch(next))
  }

  // Implement Your Service Function
  sayWorld(req, res) {
    res.send('world')
  }
}

module.exports = MyService
```

### Change Controller

If You Want Change Controller Instead Of `Built-In Controller`. Just Redefine Static Property `controller`. And `User Define Controller` Must Be Place In RapidFire Configuration `paths.controllers` Path.

```javascript
const {
  Interfaces: { Service },
} = require('@luasenvy/rapidfire')

// Controller Must Class. Not Instance.
const MyController = require('../some/your/controllers/path/MyController')

class MyService extends Service {
  // Change Controller.
  static controller = MyController

  constructor({ router }) {
    super()

    // Mapping With URI Via `router` Parameter.
    router.get('/my-controller-send-file', (req, res, next) => this.sendFile(req, res).catch(next))
  }

  // Implement Your Service Function
  sendFile(req, res) {
    // `this.controller` Will Be `MyController` Instance.
    this.controller.sendFile(req, res)
  }
}

module.exports = MyService
```
