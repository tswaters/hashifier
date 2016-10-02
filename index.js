
'use strict'

const crypto = require('crypto')
const DEFAULT_ITERATIONS = 100000
const DEFAULT_ALGORITHM = 'sha512'
const DEFAULT_ENCODING = 'hex'
const DEFAULT_SALT_LENGTH = 128
const DEFAULT_KEY_LEN = 128

/**
 * @typedef HashOptions
 * @property {number} [iterations=100000] number of iterations
 * @property {string} [algorithm="SHA512"] algorithm to use
 * @property {string} [outputEncoding="hex"] output encoding
 * @property {number} [saltLength=128] salt length
 * @property {number} [keyLength=128] length of generated key
 */

/**
 * Hashes a value with salt.
 * @param {string} plaintext :: string to hash
 * @param {string} [salt] :: salt used to compare.
 * @param {HashOptions} [options] :: options on how to proceed.
 * @returns {Promise<string>} resolves to hash (throws errors from node-crypto if encountered)
 */
function hasher (plaintext, saltInput = null, options = {}) {

  if (saltInput != null && typeof saltInput === 'object') {
    options = saltInput
    saltInput = null
  }

  const {
    iterations = DEFAULT_ITERATIONS,
    saltLength = DEFAULT_SALT_LENGTH,
    algorithm = DEFAULT_ALGORITHM,
    encoding = DEFAULT_ENCODING,
    keyLen = DEFAULT_KEY_LEN
  } = options

  return new Promise((resolve, reject) => {
    if (saltInput) { return resolve(saltInput) }
    crypto.randomBytes(saltLength, (err, saltValue) => {
      if (err) { return reject(err) }
      resolve(saltValue.toString(encoding))
    })
  })
  .then(saltValue => {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(plaintext, saltValue, iterations, keyLen, algorithm, (err, result) => {
        if (err) { return reject(err) }
        const hash = result.toString(encoding)
        const salt = saltValue.toString(encoding)
        resolve({hash, salt})
      })
    })
  })
}

/**
 * Hashes a plaintext value.
 * @param {string} plaintext :: string to hash.
 * @param {HashOptions} options :: options on how to proceed.
 * @returns {Promise<string>} hash value.
 */
exports.hash = (plaintext, options) => hasher(plaintext, options)

/**
 * Compares a previously hashed value with plaintext
 * @param {string} plaintext :: string to compare
 * @param {string} hashValue :: previously hashed value
 * @param {HashOptions} options options to provide for hashing.
 * @returns {Promise<bool>} whether the value matches
 */
exports.compare = (plaintext, hashValue, salt, options) => hasher(plaintext, salt, options)
  .then(computed => computed.hash === hashValue)
