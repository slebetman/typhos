var chai = require('chai');
var expect = chai.expect;

var router = require('../lib/router');
var Balancer = require('../lib/balancer');

describe('Router',function(){
	it('should return server url',function(){
		var r = new Balancer();
		r.addServer('testserver:80');
		router.routes = {'test': r};
		expect(router.route('/test')).to.equal('testserver:80');
	});
	
	it('should handle wildcard url',function(){
		var r = new Balancer();
		r.addServer('testserver:80');
		router.routes = {'test': r};
		expect(router.route('/test/mango/jango')).to.equal('testserver:80');
	});
	
	it('should return undefined if no match',function(){
		var r = new Balancer();
		r.addServer('testserver:80');
		router.routes = {'test': r};
		expect(router.route('/mango')).to.be.undefined;
	});
	
	it('should handle default wildcard',function(){
		var r = new Balancer();
		r.addServer('default:80');
		router.routes = {'*': r};
		expect(router.route('/mango')).to.equal('default:80');
	});
});
