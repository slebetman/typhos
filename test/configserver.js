var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;

var configServer = require('../lib/configserver.js');
var Balancer = require('../lib/balancer');

describe('Config Server',function(){
	it('should generate new http handler',function(){
		var handler = configServer.newHandler({});
		
		expect(typeof handler).to.equal('function');
		expect(handler.length).to.equal(2); // function should have 2 arguments: request and response
	});
	
	function standardTestHandler(){
		var r = new Balancer();
		r.addServer('b');
		return configServer.newHandler({'a':r});
	}
	
	function browse(handler,method,url,params) {
		var opt = {
			method: method,
			url: url
		}
		if (params) {
			opt.params = params;
		}
		var req = mockHttp.createRequest(opt);
		var res = mockHttp.createResponse();

		handler(req,res);
		
		return res;
	}
	
	it('should handle stupid 404 requests',function(){
		var response = browse(standardTestHandler(),'GET','/stupid-request');
		expect(response.statusCode).to.equal(404);
	});
	
	it('should list routes',function(){
		var response = browse(standardTestHandler(),'GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'a':['b']});
	});
	
	it('should be able to add routes',function(){
		var handler = standardTestHandler();
		browse(handler,'GET','/add?path=c&server=d');
		var response = browse(handler,'GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'a':['b'],'c':['d']});
	});
	
	it('should add server to existing route',function(){
		var handler = standardTestHandler();
		browse(handler,'GET','/add?path=a&server=d');
		var response = browse(handler,'GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'a':['b','d']});
	});
	
	it('should be able to delete servers',function(){
		var r1 = new Balancer();
		r1.addServer('x');
		r1.addServer('y');
		
		var r2 = new Balancer();
		r2.addServer('d');
	
		var handler = configServer.newHandler({'a':r1,'c':r2});;
		browse(handler,'GET','/remove?path=a&server=x');
		var response = browse(handler,'GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'a':['y'],'c':['d']});
	});
});
