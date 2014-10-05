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
| iterations | 2000    | number of hasing iterations to use   |
| saltLength | 8       | length of the salt.                  |

The returned string from has will looks like the following: 

  {algorithm}${salt}${iterations}${hash}

## License

MIT.