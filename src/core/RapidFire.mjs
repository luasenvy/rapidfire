import RapidFire from './RapidFire.js'

class RapidFireESM extends RapidFire {
  constructor(...args) {
    super(...args)
  }

  // Override loadModule require to import
  async loadModule({ pathname }) {
    const { default: Module } = await import(pathname)
    return Module
  }
}

export default RapidFireESM
