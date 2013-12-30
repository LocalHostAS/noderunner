var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var _ = require('underscore');

describe('Command line interface',function(){
	var cli;
	
	// Make cli available to all tests
	beforeEach(function(){
		cli = rewire('../bin/noderunner');
		var S3UpdateManager = sinon.spy();
		var FTPUpdateManager = sinon.spy();
		
		var noderunner = sinon.spy();
		noderunner.prototype.start = sinon.spy();

        cli.__set__("S3UpdateManager", S3UpdateManager);
		cli.S3UpdateManager = S3UpdateManager;
        cli.__set__("FTPUpdateManager", FTPUpdateManager);
		cli.FTPUpdateManager = FTPUpdateManager;		
        cli.__set__("noderunner", noderunner);
		cli.noderunner = noderunner;
	});
	
	describe('when invoked with valid parametes', function(){
		
		var validParameters = '--name=myApp --source=s3 --bucket=myBucket --path=my/path --key=myKey --secret=mySecret';
				
		it('should create a new noderunner instance supplying options and update manager', function(){			
			cli(validParameters);
			assert(cli.noderunner.calledOnce);
			var args = cli.noderunner.getCall(0).args;
			assert(args[0].name == 'myApp', 'Command line parameter not present as noderunner options.');
			assert(args[1] != null, 'Update manager not supplied to noderunner constructor');
		});
		
		it('should start the noderunner instance', function(){
			cli(validParameters);
			assert(cli.noderunner.prototype.start.calledOnce, 'Noderunner instance not started.');
		});
		
		describe('when S3 is specified as update source', function(){
			
			beforeEach(function(){
				cli('--name=myApp --source=s3 --bucket=myBucket --path=my/path --key=myKey --secret=mySecret')
			})
				
			it('should create an S3UpdateManager instance with options', function(){
				assert(cli.S3UpdateManager.calledOnce);
				var opts = cli.S3UpdateManager.getCall(0).args[0];
			    assert(opts.name == 'myApp' && 
			                    opts.source == 's3' && 
			                    opts.bucket == 'myBucket' && 
			                    opts.path == 'my/path' &&
			                    opts.key == 'myKey' &&
			                    opts.secret == 'mySecret', 'S3UpdateManager constructor called with invalid options');
			});
			
			it('should supply the S3UpdateManager to noderunner constructor', function(){
				var noderunnerArgs = cli.noderunner.getCall(0).args;
				assert(_.find(noderunnerArgs, function(a) { 
					return (a instanceof cli.S3UpdateManager); 
				}), 'S3UpdateManager manager not passed to noderunner constructor');
			});
		});
		
		describe('when FTP is specified as update source', function(){
			
			beforeEach(function(){
				cli('--name=myApp --source=ftp --host=myHost --path=my/path --username=myUsername --password=myPassword');
			});
			
			it('should create an FTPUpdateManager instance with options', function(){
				assert(cli.FTPUpdateManager.calledOnce);
				var opts = cli.FTPUpdateManager.getCall(0).args[0];
			    assert(opts.host == 'myHost' && 
			                    opts.username == 'myUsername' && 
			                    opts.path == 'my/path' &&
			                    opts.password == 'myPassword', 'FTPUpdateManager constructor called with invalid options');
			});
			
			it('should supply the FTPUpdateManager to noderunner constructor', function(){
				var noderunnerArgs = cli.noderunner.getCall(0).args;
				assert(_.find(noderunnerArgs, function(a) { 
					return (a instanceof cli.FTPUpdateManager); 
				}), 'FTPUpdateManager manager not passed to noderunner constructor');
			});
		});
	});
		
	describe('when invoked with invalid parameters', function(){
		it('should return with exit code 1', function(done){
			var spawn = require('child_process').spawn;
			var program = spawn('bin/noderunner','--haha=222 --hoho=abcd'.split(' '));
			program.on('exit',function(code) {
				assert(code,1, 'Exit code should equal 1');
				done();
			});
		});
	});
});