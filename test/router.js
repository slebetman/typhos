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
	
	it('should route fairly',function(){
		var r = new Balancer();
		r.addServer('default:80');
		r.addServer('default:81');
		r.addServer('default:82');
		
		router.routes = {'*': r};
	
		var result = {
			'default:80': 0,
			'default:81': 0,
			'default:82': 0
		}
		
		for (var x=0; x<3000; x++) {
			result[router.route('/')] ++;
		}
		
		expect(result['default:80']/result['default:81']).to.be.closeTo(1,0.15);
		expect(result['default:82']/result['default:81']).to.be.closeTo(1,0.15);
		expect(result['default:80']/result['default:82']).to.be.closeTo(1,0.15);
	});
});
