#! /usr/bin/env node

var http = require('http');

function requestHandler (req,res) {
	res.end('Hello World');
}

http.createServer(requestHandler).listen(8880);
