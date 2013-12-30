var FTPUpdateManager = function(opts){
	if (!opts.host || !opts.username || !opts.password || !opts.path) throw "Missing required option";
	
	this.host = opts.host;
	this.username = opts.username;
	this.password = opts.password;
	this.path = opts.path;
};

module.exports = FTPUpdateManager;