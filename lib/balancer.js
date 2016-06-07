function Balancer () {
	this.servers = [];
	this.config = Balancer.defaults;
}

function pickRandom (list) {
	return list[Math.floor(Math.random()*list.length)];
}

Balancer.prototype = {
	addServer: function (url) {
		this.servers.push(url);
	},
	removeServer: function (url) {
		this.servers = this.servers.filter(function(x){
			return x != url;
		});
	},
	loadBalance: function () {
		return pickRandom(this.servers);
	}
}

Balancer.defaults = {
	algorithm: 'random'
}

module.exports = Balancer;