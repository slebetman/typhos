var chai = require('chai');
var expect = chai.expect;

var Route = require('../lib/route');

describe('Route',function(){
	it('should return route object',function(){
		var r = new Route();
		expect(r.servers).to.deep.equal([]);
		expect(r.config).to.deep.equal(Route.defaults);
	});
	
	it('should be able to add server url',function(){
		var r = new Route();
		r.addServer('a');
		expect(r.servers).to.deep.equal(['a']);
	});
	
	it('should be able to remove server url',function(){
		var r = new Route();
		r.servers = ['a','b','c'];
		r.removeServer('b');
		expect(r.servers).to.deep.equal(['a','c']);
	});
});
