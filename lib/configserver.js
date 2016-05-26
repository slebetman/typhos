var url = require('url');
var error404 = require('./error404');

var routes = {};

var configRoutes = {
	'/list': function (req,res) {
		res.end(JSON.stringify(routes));
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
				console.log('Invalid config request');
				error404(res);
			}
		}
	}
}
