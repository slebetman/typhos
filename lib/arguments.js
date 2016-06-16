// Defaults:
var conf = {
	port: 8888,
	configPort: 6060,
	server: false
};

function parse_arguments (arg_array) {
	if (!arg_array) arg_array = []; // Allow calling without arguments

	var exe = arg_array.shift();
	var script = arg_array.shift();
	
	while (arg_array.length) {
		var arg = arg_array.shift();
		
		switch (arg) {
			case '--port':
			case '-p':
				var val = arg_array.shift();
				conf.port = parseInt(val,10)
				break;
			case '--config-port':
			case '-c':
				var val = arg_array.shift();
				conf.configPort = parseInt(val,10)
				break;
			case '--server':
			case '-s':
				conf.server = true;
				break;
			case '--help':
			case '-h':
				console.log('some help');
				process.exit();
				break;
			default:
				throw('invalid argument "' + arg + '"');
		}
	}

	return conf;
}

module.exports = parse_arguments;
