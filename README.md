# native-password-hash

Wrapper to nodejs' native crypto library, for hashing passwords.
This is a lightweight alternative to using brypt; no compilation steps.

## Install

    npm install native-password-hash

## Usage

    var pass = require('password-hash');
    var hash = pass.hash('my password');   // store this somewhere
    pass.compare('my password', hash);     // true
    pass.compare('not my password', hash); // false

You can pass an options object as the last parameter to `hash`.
It accepts the following parameters:  

| value      | default | description                          |
|------------|---------|--------------------------------------|
| algorithm  | sha512  | algorithm to use for generating hash |
| iterations | 4096    | number of hasing iterations to use   |
| saltLength | 36      | length of the salt.                  |

The returned string from hash will looks like the following:

    {algorithm}${salt}${iterations}${hash}

## Benchmark

You can use the benchmark utility to find out how long a given hashing operation takes.

    $ node benchmark.js --help
    native-password-hash benchmarking utility; determines how long it takes to hash
    use this to get an idea of what to pass to {options}, given your requirements.
    usage: node benchmark.js [options] [time]
    time is the number of milliseconds you want to wait.
    options:
    --help show this help.
    --saltLength length of the salt in bytes
    --algorithm algorithm to use for hashing.
    --password password to hash [default=test]

## License

MIT.