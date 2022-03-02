const fs = require('fs')
const path = require('path')

const tlsCert = fs.readFileSync(path.join(__dirname, './certs/cert.crt'))
const tlsKey = fs.readFileSync(path.join(__dirname, './certs/cert.key'))

const { RapidFire } = require('../src/core')

const rapidFire = new RapidFire({
  host: 'localhost',
  port: 8443,
  tls: { cert: tlsCert, key: tlsKey },
})

test('RapidFire Ignition Test', done => {
  let count = 0

  rapidFire.on('open', rapidFire.extinguish)
  rapidFire.on('close', () => {
    count += 1

    if (count < 3) return rapidFire.ignition()
    done()
  })

  rapidFire.ignition()
})
