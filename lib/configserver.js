var url = require('url');
var q = require('querystring');

var error404 = require('./error404');
var Balancer = require('./balancer');

var routes = {};

var configRoutes = {
	'/list': function (req,res) {
		var plain_routes = {};
		
		for (var n in routes) {
			plain_routes[n] = routes[n].servers;
		}
		
		res.end(JSON.stringify(plain_routes));
	},
	'/add': function (req,res) {
		var newServer = q.parse(url.parse(req.url).query);
		var path = newServer.path;
		
		if (!routes[path]) {
			routes[path] = new Balancer();
		}
		routes[path].addServer(newServer.server);
		
		res.end('OK');
	},
	'/new': function (req,res) { // like add but check for duplicates
		var newServer = q.parse(url.parse(req.url).query);
		var path = newServer.path;
		
		if (!routes[path]) {
			routes[path] = new Balancer();
		}
		routes[path].newServer(newServer.server);
		
		res.end('OK');
	},
	'/remove': function (req,res) {
		var oldServer = q.parse(url.parse(req.url).query);
		var path = oldServer.path;
		
		if (routes[path]) {
			routes[path].removeServer(oldServer.server);
			res.end('OK');
		}
		else {
			error404(res);
		}
	},
}

module.exports = {
	newHandler: function (router_routes) {
		routes = router_routes;
		
		return function (req,res) {
			var path = url.parse(req.url).pathname;
			
			if (typeof configRoutes[path] == 'function') {
				configRoutes[path](req,res);
			}
			else {
				error404(res);
			}
		}
	}
}
