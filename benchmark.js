
'use strict'

const DEFAULT_PASS = 'test'

const pass = require('./index.js')

const args = process.argv.slice(2)
const showHelp = parseArgument('--help', true)
const password = parseArgument('--password') || DEFAULT_PASS
const algorithm = parseArgument('--algorithm')
let saltLength = parseArgument('--saltLength')


if (showHelp || args.length !== 1) {
  help()
  process.exit(0)
}

const strTime = args[0].replace(/ms$/, '')
const targetTime = parseInt(strTime, 10)
saltLength = saltLength && parseInt(saltLength, 10)

if (targetTime < 1) {
  error('Time must be a positive integer.')
}

// perform one hash to warm up the cache
pass.hash('')

// console.info('got targetTime: %s', targetTime)
// console.info('got password: %s', password)
// console.info('got algorithm: %s', algorithm)
// console.info('got saltLength: %s', saltLength)

let iterations = 1
let i = 0
let timeSpent = 0
let start = null
let end = null
while (timeSpent < targetTime) {
  start = (new Date()).getTime()
  pass.hash(password, {
    iterations,
    algorithm,
    saltLength
  })
  end = (new Date()).getTime()
  timeSpent = (end - start)
  iterations = Math.pow(2, ++i)
}

console.log('%s iterations took %s', iterations, timeSpent + 'ms')

function parseArgument (argName, noarg) {
  const index = args.indexOf(argName)
  if (index > -1 && index < args.length - (noarg ? 0 : 1)) {
    return args.splice(index, noarg ? 1 : 2)[ noarg ? 0: 1]
  }
  return undefined
}

function error (msg) {
  console.error('Error: ' + msg)
  help()
  process.exit(1)
}

function help () {
  const msg = [
    'native-password-hash benchmarking utility determines how long it takes to hash.',
    'use this to get an idea of what to pass to {options}, given your requirements.',
    'usage: node benchmark.js [options] [time]',
    'time is the number of milliseconds you want to wait.',
    'options:',
    '--help show this help.',
    '--saltLength length of the salt in bytes',
    '--algorithm algorithm to use for hashing.',
    '--password password to hash [default=test]'
  ]
  console.log(msg.join(require('os').EOL))
}
