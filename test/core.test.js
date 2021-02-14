const { RapidFire } = require('../src/core')

const rapidFire = new RapidFire({ host: 'localhost', port: 8000 })

test('RapidFire Ignition Test', done => {
  let count = 0

  rapidFire.on('open', rapidFire.extinguish)
  rapidFire.on('close', () => {
    count += 1

    if (count < 5) return rapidFire.ignition()
    done()
  })

  rapidFire.ignition()
})
