var url = require('url');
var q = require('querystring');
var error404 = require('./error404');

var routes = {};

var configRoutes = {
	'/list': function (req,res) {
		res.end(JSON.stringify(routes));
	},
	'/add': function (req,res) {
		var newServer = q.parse(url.parse(req.url).query);
		var path = newServer.path;
		
		if (!routes[path]) {
			routes[path] = [];
		}
		routes[path].push(newServer.server);
		
		res.end('OK');
	}
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
