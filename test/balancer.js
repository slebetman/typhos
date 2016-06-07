var chai = require('chai');
var expect = chai.expect;

var Balancer = require('../lib/balancer');

describe('Balancer',function(){
	it('should return balancer object',function(){
		var r = new Balancer();
		expect(r.servers).to.deep.equal([]);
		expect(r.config).to.deep.equal(Balancer.defaults);
	});
	
	it('should be able to add server url',function(){
		var r = new Balancer();
		r.addServer('a');
		expect(r.servers).to.deep.equal(['a']);
	});
	
	it('should be able to remove server url',function(){
		var r = new Balancer();
		r.servers = ['a','b','c'];
		r.removeServer('b');
		expect(r.servers).to.deep.equal(['a','c']);
	});
	
	it('should return server url when load balancing',function(){
		var r = new Balancer();
		r.addServer('a');
		
		expect(r.loadBalance()).to.equal('a');
	});
	
	it('should load balance fairly',function(){
		var r = new Balancer();
		r.addServer('default:80');
		r.addServer('default:81');
		r.addServer('default:82');
		
		var result = {
			'default:80': 0,
			'default:81': 0,
			'default:82': 0
		}
		
		for (var x=0; x<3000; x++) {
			result[r.loadBalance()] ++;
		}
		
		expect(result['default:80']/result['default:81']).to.be.closeTo(1,0.15);
		expect(result['default:82']/result['default:81']).to.be.closeTo(1,0.15);
		expect(result['default:80']/result['default:82']).to.be.closeTo(1,0.15);
	});
});
