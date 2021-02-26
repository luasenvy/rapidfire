const {
  Interfaces: { Service, Controller, ServiceLoader },
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

test('"Service" Interface implementation Test', () => {
  expect(MyService.loader).toEqual(MyServiceLoader)
  expect(MyService.controller).toEqual(MyController)
})
