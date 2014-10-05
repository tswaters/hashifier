"use strict";

var crypto = require("crypto");

/**
 * @typedef HashOptions
 * @type {object}
 * @property {string} [algorithm="sha512"]
 * @property {number} [iterations=4096]
 * @property {number} [saltLength=32]
 */

/**
 * How many bytes to use for the hash.
 */
var DEFAULT_SALT_LENGTH = 32;

/**
 * Default number of iterations to perform.
 */
var DEFAULT_ITERATIONS = 4096;

/**
 * Default algorithm to use.
 */
var DEFAULT_ALGORITHM = "sha512";

/**
 * Hashes a value with salt.
 * @param {string} plaintext :: string to hash
 * @param {string} [salt] :: salt used to compare.
 * @param {HashOptions} [options] :: options on how to proceed.
 * @returns {string} :: hash
 * @throws exception if bad arguments provided.
 */
function hash (plaintext /*, salt, options*/ ) {
	var salt, options = {};
	// figure out what parameters have been passed.
	switch (arguments.length) {
		case 1:
			break;
		case 2:
			if (typeof arguments[1] === "object") {
				options = arguments[1];
			}
			else {
				salt = arguments[1];
			}
			break;
		case 3:
			salt = arguments[1];
			options = arguments[2];
			break;
		default:
			throw "Invalid arguments provided.";
	}

	// load default options if unprovided or of the wrong type.
	if (typeof options.iterations === "undefined" || typeof options.iterations !== "number" || options.iterations < 1) { options.iterations = DEFAULT_ITERATIONS; }
	if (typeof options.algorithm === "undefined" || typeof options.algorithm !== "string") { options.algorithm = DEFAULT_ALGORITHM; }
	if (typeof options.saltLength === "undefined" || typeof options.saltLength !== "number" || options.saltLength < 1) { options.saltLength = DEFAULT_SALT_LENGTH; }

	// console.info("got iterations %s", options.iterations)
	// console.info("got algorithm %s", options.algorithm)
	// console.info("got saltLength %s", options.saltLength)

	// ensure the specified algorithm is available to crypto.
	if (crypto.getHashes().indexOf(options.algorithm) === -1) {
		throw "Hashing algorithm " + options.algorithm + " is not available.";
	}

	// if has hasn"t been provided, generate it.
	if (typeof salt === "undefined" || typeof salt !== "string") {
		salt = crypto.randomBytes(options.saltLength).toString("hex");
	}

	// generate the hash.
	for (var hashed = plaintext, i = 0, I = options.iterations; i < I; i++) {
		hashed = crypto.createHmac(options.algorithm, salt).update(hashed).digest("hex");
	}

	return [options.algorithm, salt, options.iterations, hashed].join("$");
}

module.exports = {

	/**
	 * Hashes a plaintext value.
	 * @param {string} plaintext :: string to hash.
	 * @param {HashOptions} options :: options on how to proceed.
	 * @returns {string}  salt;hash
	 */
	hash: function (plaintext, options) {
		return hash(plaintext, options);
	},

	/**
	 * Compares a previously hashed value with plaintext
	 * @param {string} plaintext :: string to compare
	 * @param {string} hashValue :: previously hashed value
	 * @returns {boolean} whether the value matches
	 */
	compare: function (plaintext, hashValue) {
		var values = hashValue.split("$");
		var salt = values[1];
		var options = {
			algorithm: values[0],
			iterations: values[2]
		};
		return hash(plaintext, salt, options) === hashValue;
	}
};
