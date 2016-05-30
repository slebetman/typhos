var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;

var configServer = require('../lib/configserver.js');

describe('Config Server',function(){
	it('should generate new http handler',function(){
		var handler = configServer.newHandler({});
		
		expect(typeof handler).to.equal('function');
		expect(handler.length).to.equal(2); // function should have 2 arguments: request and response
	});
	
	function standardTestHandler(){
		return configServer.newHandler({'a':'b'});
	}
	
	function standardTest(method,url,params) {
		var opt = {
			method: method,
			url: url
		}
		if (params) {
			opt.params = params;
		}
		var req = mockHttp.createRequest(opt);
		var res = mockHttp.createResponse();
		
		var handler = standardTestHandler();
		
		handler(req,res);
		
		return res;
	}
	
	it('should handle stupid 404 requests',function(){
		var response = standardTest('GET','/stupid-request');
		expect(response.statusCode).to.equal(404);
	});
	
	it('should list routes',function(){
		var response = standardTest('GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'a':'b'});
	});
});
