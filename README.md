# Hashifier

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]

Light-weight wrapper to nodejs crypto library for hashing passwords using pbkdf2

## Requirements

node 6.

## Install

```
npm install hashifier
```

## API

Each function returns a promise that resolves as specified.

Any errors encountered by the crypto module will reject the promise.

_hash(plainText, options?)_
 - hash a given password
 - resolves to an object, {hash, salt}
 - see options below

_compare(plainText, hash, salt, options?)_
 - compare a previously hashed password
 - resolves to a boolean
 - see options below

### options

- _iterations_ - number of iterations to hash (default 100,000)
- _algorithm_ - algorithm to use for hashing (default sha512)
- _encoding_ - output encoding to use (default hex)
- _saltLength_ - number of bytes to use for the salt (default 128)
- _keyLength_ - length of the key (default 128)

## Usage

```js
const hashifier = require('hashifier')

// options are optional, following is default
const options = {
  iterations: 100000
  algorithm: 'sha512'
  encoding: 'hex'
  saltLength: = 128
  keyLength: 128
}

hashifier.hash('my password', options) // {salt: string, hash: string}
  .then(result => {
    hashifier.compare('my password', result.hash, result.salt, options).then(result => assert.ok(result)) // true
    hashifier.compare('not my password', result.hash, result.salt, options).then(result => result.notOk(result)) // false
  })
```

## License

MIT.

[npm-badge]: https://badge.fury.io/js/hashifier.svg
[npm-url]: https://badge.fury.io/js/hashifier
[travis-badge]: https://travis-ci.org/tswaters/hashifier.svg?branch=master
[travis-url]: https://travis-ci.org/tswaters/hashifier
[coveralls-badge]: https://coveralls.io/repos/github/tswaters/hashifier/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/tswaters/hashifier?branch=master
[david-badge]: https://david-dm.org/tswaters/hashifier.svg
[david-url]: https://david-dm.org/tswaters/hashifier
