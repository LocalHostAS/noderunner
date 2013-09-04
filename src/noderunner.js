var fs = require('fs');
var os = require('os');
var path = require('path');
var spawn = require('child_process').spawn;
var crypto = require('crypto');
var rmdir = require('rimraf');
var _ = require('underscore');
var S3UpdateManager = require('./S3UpdateManager');

var tmpDirName = 'noderunner';
var startCommand = 'node';
var startArgs = ['server.js'];
var pollingInterval = 60 * 1000;

module.exports = {
	start: function(s3Bucket,s3Path, s3Key, s3Secret,appName) {

		// Determine directory names
		var tmpDir = path.join(os.tmpDir(),tmpDirName);
		var subDir = path.join(tmpDir, appName || crypto.createHash('md5').update(s3Path).digest("hex"));
		
		var updateManager = new S3UpdateManager(subDir,s3Bucket,s3Path, s3Key, s3Secret, pollingInterval);
		var currentProcess = null;
				
		// Create directories as needed
		if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
		if (!fs.existsSync(subDir)) fs.mkdirSync(subDir);
	
		// Function for spawning a new version
		var start = function(dirName){
			
			// Require package.json from new version
			var pkg = require(dirName + '/package.json');
			var startCmd = ((pkg.scripts || {})['start']) || "";
		
			if (startCmd)
			{
				startCommand = startCmd.split(' ')[0];
				startArgs = startCmd.split(' ').slice(1);
			}
			
			var oldDir = (currentProcess || {}).path;
			currentProcess = spawn(startCommand,startArgs,{cwd: dirName});
			currentProcess.path = dirName;
			currentProcess.stdout.on('data', function (data) {
			  console.log('stdout: ' + data);
			});

			currentProcess.stderr.on('data', function (data) {
			  console.log('stderr: ' + data);
			});
			if (oldDir && oldDir != dirName) {
				setTimeout(function(){
					rmdir(oldDir, function(err){ 
									if (err) console.log('FAILED to delete folder ' + oldDir);
									else console.log('Deleted folder ' + oldDir);
								});
				},10*1000);
			};
		}
		
		// Set initial busy state		
		var busy = false;
			
		// Retrieve latest version
		updateManager.getLatestVersion(function(err,dirName){
			if (err) {
				console.log('Update check FAILED.');
				return;
			} 
			if (busy) {
				console.log('Busy, ignoring update message.');
				return;
			}
			
			busy = true;
						
			// Stop current process and start new
			if (currentProcess) 
			{
				if (currentProcess.path == dirName && currentProcess.exitCode === null)
				{
					busy = false;
					return;
				}
				else if (currentProcess.path == dirName)
				{
					console.log('Process has STOPPED, trying to restart');
					busy = false;
					start(dirName);
				}
				else
				{
					if (currentProcess.exitCode === null)
					{
						currentProcess.on('exit', function(code){
							console.log('Child process exited with code ' + code);
							busy = false;
							start(dirName);
						});

						console.log('New version available ('+  _.last(dirName.split('/')) +'), killing running process...');
						currentProcess.kill('SIGKILL');
					}
					else
					{
						console.log('Process has STOPPED, new version available (bugfix), trying to restart');
						busy = false;
						start(dirName);
					}
				}
			}
			else
			{
				console.log('No running process, starting ('+  _.last(dirName.split('/')) +')..');
				busy = false;
				start(dirName);
			}
		});
	}
};