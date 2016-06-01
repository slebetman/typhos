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
		return configServer.newHandler({'a':['b']});
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
		var handler = configServer.newHandler({'a':['x','y'],'c':['d']});;
		browse(handler,'GET','/remove?path=a&server=x');
		var response = browse(handler,'GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'a':['y'],'c':['d']});
	});
	
	it('should delete route when last server is deleted',function(){
		var handler = configServer.newHandler({'a':['y'],'c':['d']});;
		browse(handler,'GET','/remove?path=a&server=y');
		var response = browse(handler,'GET','/list');
		var data = JSON.parse(response._getData());
		expect(data).to.deep.equal({'c':['d']});
	});
});
