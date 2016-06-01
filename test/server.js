var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;

var server = require('../lib/server');
var router = require('../lib/router');

router.routes = {'a':['b']};

describe('Server',function(){
	it('should generate new http handler',function(){
		var handler = server.newHandler(router);
		
		expect(typeof handler).to.equal('function');
		expect(handler.length).to.equal(2); // function should have 2 arguments: request and response
	});
});
