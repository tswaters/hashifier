
"use strict";

var DEFAULT_PASS = "test";

var pass = require("./index.js");

var args = process.argv.slice(2);
var showHelp = parseArgument("--help", true);
var password = parseArgument("--password") || DEFAULT_PASS;
var algorithm = parseArgument("--algorithm");
var saltLength = parseArgument("--saltLength");


if (showHelp || args.length !== 1) {
	help();
	process.exit(0);
}

var strTime = args[0].replace(/ms$/, "");
var targetTime = parseInt(strTime, 10);
saltLength = saltLength && parseInt(saltLength, 10);

if (targetTime < 1) {
	error("Time must be a positive integer.");
}

// perform one hash to warm up the cache
pass.hash("");

// console.info("got targetTime: %s", targetTime)
// console.info("got password: %s", password);
// console.info("got algorithm: %s", algorithm);
// console.info("got saltLength: %s", saltLength);

var iterations = 1, i = 0, timeSpent = 0, start, end;
while (timeSpent < targetTime) {
	start = (new Date()).getTime();
	pass.hash(password, {
		iterations: iterations,
		algorithm: algorithm,
		saltLength: saltLength
	});
	end = (new Date()).getTime();
	timeSpent = (end - start);
	iterations = Math.pow(2, ++i);
}

console.log("%s iterations took %s", iterations, timeSpent + "ms");

function parseArgument (argName, noarg) {
	var index = args.indexOf(argName);
	if (index > -1 && index < args.length - (noarg ? 0 : 1)) {
		return args.splice(index, noarg ? 1 : 2)[ noarg ? 0: 1];
	}
	return undefined;
}

function error (msg) {
	console.error("Error: " + msg)
	help();
	process.exit(1);
}

function help () {
	var msg = [
		"native-password-hash benchmarking utility; determines how long it takes to hash.",
		"use this to get an idea of what to pass to {options}, given your requirements.",
		"usage: node benchmark.js [options] [time]",
		"time is the number of milliseconds you want to wait.",
		"options:",
		"--help show this help.",
		"--saltLength length of the salt in bytes",
		"--algorithm algorithm to use for hashing.",
		"--password password to hash [default=test]"
	];
	console.log(msg.join(require("os").EOL));
}
