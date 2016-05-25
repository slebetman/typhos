#! /usr/bin/env node

var http = require('http');

var count = 0;

function requestHandler (req,res) {
	count++
	process.stdout.write('\r ' + count + ' ');
	res.end('Hello World');
}

http.createServer(requestHandler).listen(8880);
