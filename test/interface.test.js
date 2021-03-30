const {
  Interfaces: { Service, Controller, ServiceLoader, Middleware },
} = require('../src/index')

class MyController extends Controller {
  constructor() {
    super()
  }
}

class MyServiceLoader extends ServiceLoader {
  constructor() {
    super()
  }
}

class MyService extends Service {
  static loader = MyServiceLoader

  static controller = MyController

  constructor() {
    super()
  }
}

class MyMiddleware extends Middleware {
  constructor() {
    super()

    this.type = 'helloworld'
  }
}

describe('unit/interfaces', () => {
  test('"Service" Interface implementation Test', async next => {
    expect(MyService.loader).toEqual(MyServiceLoader)
    expect(MyService.controller).toEqual(MyController)

    next()
  })

  test('"Middleware" Interface implementation Test', async next => {
    next()
  })
})
