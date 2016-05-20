#! /usr/bin/env node

var request = require('request');

var target = 'http://localhost:8888';
var clients = 10;

var test_clients = [];

var success = 0;
var failures = 0;

function TestClient (url) {
	this.running = true;
	
	this.run(url);
}

TestClient.prototype = {
	run: function (url) {
		var self = this;
		
		request(url,function(err,res,body){
			success++;
			
			if (self.running) {
				self.run(url);
			}
		});
	},
	stop: function () {
		this.running = false;	
	}
}

// var spinner = '/-\|';
// var spinner = '.oOo';
// var spinner = '.oO0Oo';
// var spinner = '←↖↑↗→↘↓↙';
var spinner = '◐◓◑◒◐◓◑◒';
var start = Date.now();
var status = ' ...';
var n = 0;

function displayStats () {
	n = (n+1) % spinner.length;
	
	if (n == 0) {
		var now = Date.now();
		var total = success+failures;
	
		status = ' Requests per second: ' + Math.round(total / ((now - start)/1000)) + ', total: ' + total;
	}
	
	process.stdout.write('\r ' + spinner[n] + status + '   ');
}

for (var i=0; i<clients; i++) {
	test_clients.push(new TestClient(target));
}

setInterval(displayStats, 100);

