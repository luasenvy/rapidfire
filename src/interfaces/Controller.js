class Controller {
  constructor({ multer }) {
    this.isDev = process.env.NODE_ENV !== 'production'
    this.multer = multer
  }
}

module.exports = Controller
