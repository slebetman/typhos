var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;

var error404 = require('../lib/error404.js');

describe('Error 404',function(){
	it('should generate proper 404 response',function(){
		var res = mockHttp.createResponse();
		
		error404(res);
		expect(res.statusCode).to.equal(404);
	});
});
