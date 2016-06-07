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
var route_defs = {
	"*": [
		"127.0.0.1:8880",
		"127.0.0.1:8880",
		"127.0.0.1:8880"
	],
	"mango/jango" : [
		"127.0.0.1:333"
	],
	"mango/*" : [
		"127.0.0.1:444",
		"127.0.0.2:444"
	]
} 

for (var path in route_defs) {
	var urls = route_defs[path];
	var r = new Balancer(path);
	
	for (var i=0;i<urls.length;i++) {
		r.addServer(urls[i]);
	}
	routes[path] = r;
}

var router = {
	routes: routes,
	getServers: getServers,
	route: route,
}

module.exports = router;
