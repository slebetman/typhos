var url = require('url');

var error404 = require('./error404');
var router;
var proxy;

function responseHandler (req,res) {
	var path = url.parse(req.url).pathname;	
	console.log('Request:', path);
	
	var s = router.route(path);
	
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

module.exports = {
	newHandler: function (router_instance,proxy_instance) {
		router = router_instance;
		proxy = proxy_instance;
		return responseHandler;
	}
};
