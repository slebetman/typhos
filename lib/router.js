var url = require('url');
var http_proxy = require('http-proxy');

var error404 = require('./error404');
var Balancer = require('./balancer');

function getServers (path) {
	var totalpath = '';
	var servers;
	
	for (var i=path.length; i>=0; i--) {
		totalpath = path.slice(0,i).join('/');
		servers = router.routes[totalpath];
		if (!servers) {
			servers = router.routes[totalpath + '/*'];
		}
		if (servers) {
			break;
		}
	}
	if (!servers) {
		servers = router.routes['*'];
	}
	
	return servers;
}

function route (path) {
	var p = path.split('/').slice(1);

	var servers = getServers(p);
	
	if (servers) {
		return servers.loadBalance();
	}
}

var routes = {};

var router = {
	routes: routes,
	getServers: getServers,
	route: route,
}

module.exports = router;
