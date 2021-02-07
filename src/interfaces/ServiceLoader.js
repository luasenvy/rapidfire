class ServiceLoader {
  constructor() {}

  load({ db, express, Service }) {
    const service = new Service({ router: express.Router() })
    service.db = db
    return service
  }
}

module.exports = ServiceLoader
