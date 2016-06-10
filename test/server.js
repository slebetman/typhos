var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;

var server = require('../lib/server');
var router = require('../lib/router');
var Balancer = require('../lib/balancer');

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

function fake_proxy (error) {
	return {web:function(req,res,params,err_callback){
		if (error) err_callback('TESTING');
	}};
}

describe('Server',function(){
	it('should generate new http handler',function(){
		var handler = server.newHandler(router,fake_proxy());
		
		expect(typeof handler).to.equal('function');
		expect(handler.length).to.equal(2); // function should have 2 arguments: request and response
	});
	
	it('should handle good requests',function(){
		router.routes = {
			'a': new Balancer(),
			'b': new Balancer()
		}
		
		router.routes.a.addServer('x');
		router.routes.a.addServer('y');
		router.routes.b.addServer('z');
	
		var handler = server.newHandler(router,fake_proxy());
		
		var response = browse(handler,'GET','/a');
		expect(response.statusCode).to.equal(200);
	});
	
	it('should error on bad requests',function(){
		router.routes = {
			'a': new Balancer(),
			'b': new Balancer()
		}
		
		router.routes.a.addServer('x');
		router.routes.a.addServer('y');
		router.routes.b.addServer('z');
	
		var handler = server.newHandler(router,fake_proxy());
		
		var response = browse(handler,'GET','/mango/jango');
		expect(response.statusCode).to.equal(404);
	});
	
	it('should handle server offline',function(){
		router.routes = {
			'a': new Balancer(),
			'b': new Balancer()
		}
		
		router.routes.a.addServer('x');
		router.routes.a.addServer('y');
		router.routes.b.addServer('z');
	
		var handler = server.newHandler(router,fake_proxy(1));
		
		var response = browse(handler,'GET','/a');
		expect(response.statusCode).to.equal(404);
	});
});
