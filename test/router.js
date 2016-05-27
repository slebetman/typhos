var chai = require('chai');
var expect = chai.expect;

var router = require('../lib/router');

describe('Router',function(){
	it('should return server url',function(){
		router.routes = {
			'test': ['testserver:80']
		}
		
		expect(router.route('/test')).to.equal('testserver:80');
	});
	
	it('should handle wildcard url',function(){
		router.routes = {
			'test/*': ['testserver:80']
		}
		
		expect(router.route('/test/mango/jango')).to.equal('testserver:80');
	});
	
	it('should return undefined if no match',function(){
		router.routes = {
			'test': ['testserver:80']
		}
		
		expect(router.route('/mango')).to.be.undefined;
	});
	
	it('should handle default wildcard',function(){
		router.routes = {
			'*': ['default:80']
		}
		
		expect(router.route('/mango')).to.equal('default:80');
	});
});
