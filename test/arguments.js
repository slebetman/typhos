var mockHttp = require('node-mocks-http');
var chai = require('chai');
var expect = chai.expect;

var parse_args = require('../lib/arguments');
var testEnvironment = require('./test_env');

describe('Parse Arguments',function(){
	it('should return config object',function(){
		var conf = parse_args();
		
		expect(conf).to.be.an('object');
	});
	
	it('should populate all config',function(){
		var conf = parse_args([]);
		
		expect(conf).to.deep.equal({
			port: 8888,
			configPort: 6060,
			server: false
		});
	});
	
	it('should parse server port', function(){
		var conf = parse_args(['node','typhon','--port','9999']);	
		expect(conf.port).to.equal(9999);
		conf = parse_args(['node','typhon','-p','1111']);		
		expect(conf.port).to.equal(1111);
	});
	
	it('should parse config server port', function(){
		var conf = parse_args(['node','typhon','--config-port','9999']);		
		expect(conf.configPort).to.equal(9999);
		conf = parse_args(['node','typhon','-c','1111']);		
		expect(conf.configPort).to.equal(1111);
	});
	
	it('should throw error on invalid argument', function(){
		expect(function(){
			parse_args(['node','typhon','--mango']);
		}).to.throw('invalid argument "--mango"');
	});
	
	it('should retain previous configuration',function(){
		parse_args(['node','typhon','--port','4321']);
		var conf = parse_args([]);
		expect(conf.port).to.equal(4321);
		p = require('../lib/arguments.js');
		conf = p([]);
		expect(conf.port).to.equal(4321);
	});
	
	it('should parse server mode',function(){
		var conf = parse_args(['node','typhon','--server']);	
		expect(conf.server).to.be.true;
	});
	
	it('should print help and exit',function(){
		var result = testEnvironment(function(){
			parse_args(['node','typhon','--help']);
		});
		
		expect(result.exit).to.be.true;
		expect(result.logs.length > 0).to.be.ok;
		
		result = testEnvironment(function(){
			parse_args(['node','typhon','-h']);
		});
		
		expect(result.exit).to.be.true;
		expect(result.logs.length).to.be.above(0);
	});
});
