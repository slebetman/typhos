var url = require('url');
var http_proxy = require('http-proxy');
var error404 = require('./error404');

var proxy = http_proxy.createProxyServer({});

function pickRandom (list) {
	return list[Math.floor(Math.random()*list.length)];
}

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
		return pickRandom(servers);
	}
}

function responseHandler (req,res) {
	var path = url.parse(req.url).pathname;	
	console.log('Request:', path);
	
	var s = route(path);
	
	if (s) {
		console.log('Found server:', s);
		proxy.web(req,res,{ target: 'http://' + s }, function (e) {
			console.log('Error:', e);
			error404(res);
		});
	}
	else {
		console.log('No routes found');
		error404(res);
	}
}

var router = {
	routes: {
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
	},
	getServers: getServers,
	route: route,
	handler: responseHandler
}

module.exports = router;
