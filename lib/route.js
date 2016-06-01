function Route () {
	this.servers = [];
	this.config = Route.defaults;
}

Route.prototype = {
	addServer: function (url) {
		this.servers.push(url);
	},
	removeServer: function (url) {
		this.servers = this.servers.filter(function(x){
			return x != url;
		});
	}
}

Route.defaults = {
	algorithm: 'random'
}

module.exports = Route;