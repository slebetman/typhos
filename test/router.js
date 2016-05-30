var chai = require('chai');
var expect = chai.expect;

var router = require('../lib/router');

describe('Router',function(){
	it('should return server url',function(){
		router.routes = {'test': ['testserver:80']};
		expect(router.route('/test')).to.equal('testserver:80');
	});
	
	it('should handle wildcard url',function(){
		router.routes = {'test/*': ['testserver:80']};
		expect(router.route('/test/mango/jango')).to.equal('testserver:80');
	});
	
	it('should return undefined if no match',function(){
		router.routes = {'test': ['testserver:80']}
		expect(router.route('/mango')).to.be.undefined;
	});
	
	it('should handle default wildcard',function(){
		router.routes = {'*': ['default:80']};
		expect(router.route('/mango')).to.equal('default:80');
	});
	
	it('should route fairly',function(){
		router.routes = {'*': [
			'default:80',
			'default:81',
			'default:82'
		]};
		
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
