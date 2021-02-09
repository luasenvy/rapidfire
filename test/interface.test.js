const {
  Interfaces: { Service, Controller, ServiceLoader },
} = require('../src/index')

class MyService extends Service {
  constructor() {
    super()
  }
}

test('"Service" Interface implementation Test', () => {
  const myService = new MyService()
  expect(MyService.loader).toEqual(ServiceLoader)
  expect(myService.controller.constructor).toEqual(Controller)
})
