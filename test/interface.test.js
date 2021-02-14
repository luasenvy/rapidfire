const {
  Interfaces: { Service, Controller, ServiceLoader },
} = require('../src/index')

class MyService extends Service {
  constructor() {
    super()
  }
}

test('"Service" Interface implementation Test', () => {
  expect(MyService.loader).toEqual(ServiceLoader)
  expect(MyService.controller).toEqual(Controller)
})
