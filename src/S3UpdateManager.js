var fs = require('fs');
var path = require('path');
var knox = require('knox');
var s3 = require('s3');
var moment = require('moment');
var Zip = require('adm-zip');

var S3UpdateManager = function(options)
{
	if (!options.bucket || !options.path || !options.key || !options.secret)
	{
		throw "Options must include bucket, path, key, and secret";
	}
	
	this.pollingInterval = options.pollingInterval || 60000;
//	this.workingDir = workingDir;
	this.busy = false;
	this.s3Path = options.path;
	this.s3Client = knox.createClient({
	    key: options.key,
	   	secret: options.secret,
	   	bucket: options.bucket
	});
	this.s3Download = s3.fromKnox(this.s3Client);
}

S3UpdateManager.prototype.getLatestVersion = function(cb) {
	var self = this;
	
	if (!self.busy)
	{
		self.busy = true;
		
		// Poll file info
		self.s3Client.headFile(self.s3Path, function(err, res){		
			if (err) 
			{
				self.busy = false;
				return cb(err);
			}
	  	
			// Determine version, directory, and archive names
			var version = moment(res.headers['last-modified']).format('DD_MM_YYYY_HH_mm');
			var dirName = path.join(self.workingDir,version);
			var archiveName = dirName + '.zip';
		
			// If latest version exists, return
			if (fs.existsSync(dirName)){
				self.busy = false;
				return cb(null,dirName);
			}
			
			// Download file
			var downloader = self.s3Download.download(self.s3Path, archiveName);
			downloader.on('error', function(err) {
				self.busy = false;
				return cb(err);
			});
			downloader.on('end', function() {
				var zip = new Zip(archiveName);
				zip.extractAllTo(dirName, true);
				fs.unlinkSync(archiveName);
				self.busy = false;
				return cb(null,dirName);
			});
		});
	}
	
	// Schedule to run again
	setTimeout(function(){
		S3UpdateManager.prototype.getLatestVersion.call(self,cb);
	}, self.pollingInterval);
};

module.exports = S3UpdateManager;