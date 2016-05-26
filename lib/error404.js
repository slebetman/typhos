function error404 (res) {
	res.writeHead(404,{"Content-Type": "text/plain"});
	res.write('Not Found');
	res.end();
}

module.exports = error404;
