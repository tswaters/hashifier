
'use strict'

const hashifier = require('..')
const assert = require('assert')

describe('hashifier', () => {

  const password = 'This is my password. There are many like it, but this one is mine.'

  it('should hash and compare properly', () => {

    return hashifier.hash(password)
      .then(result => hashifier.compare(password, result.hash, result.salt))
      .then(result => assert.ok(result))

  })

})
