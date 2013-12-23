var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var _ = require('underscore');

describe('Command line interface',function(){
	var cli;
	var validArgs = '--name=myApp --source=s3 --bucket=myBucket --path=my/path --key=myKey --secret=mySecret';
	var invalidArgs = '';
	
	beforeEach(function(){
		// Setup
		cli = rewire('../bin/noderunner');
        
		var S3UpdateManager = sinon.spy();
		var noderunner = {
			start: sinon.spy()
		}

        cli.__set__("S3UpdateManager", S3UpdateManager);
		cli.S3UpdateManager = S3UpdateManager;		
        cli.__set__("noderunner", noderunner);
		cli.noderunner = noderunner;
	});
		
	it('should accept s3 source parameter, create s3 update manager instance with options, pass it along to noderunner.start()', function(){
		
		// Act
		cli('--name=myApp --source=s3 --bucket=myBucket --path=my/path --key=myKey --secret=mySecret');
		
		assert(cli.S3UpdateManager.calledOnce, 'S3UpdateManager constructor not called');
		var opts = cli.S3UpdateManager.getCall(0).args[0];
	    assert(opts.name == 'myApp' && 
	                    opts.source == 's3' && 
	                    opts.bucket == 'myBucket' && 
	                    opts.path == 'my/path' &&
	                    opts.key == 'myKey' &&
	                    opts.secret == 'mySecret', 'S3UpdateManager constructor called with invalid options');
		
		assert(cli.noderunner.start.calledOnce, 'noderunner.start() not called');
		var startArgs = cli.noderunner.start.getCall(0).args;
		assert(_.find(startArgs, function(a) { 
			return (a instanceof cli.S3UpdateManager); 
		}), 'S3UpdateManager manager not passed to noderunner.start()');
	});
	
	it('should accept arguments name, source=ftp, host, username, password, and path, and pass them along to noderunner.start() as an object', function(){
		
		// Setup
		var cli = rewire('../bin/noderunner');
        var startSpy = sinon.spy();                
        cli.__set__("noderunner", { start: startSpy });
		
		// Act
		cli('--name=myApp --source=ftp --host=myHost --username=myUsername --password=myPassword --path=my/path');
		
		// Assert
		assert(startSpy.calledOnce);
		var opts = startSpy.getCall(0).args[0];
		assert(opts.name == 'myApp' && 
				opts.source == 'ftp' && 
				opts.host == 'myHost' && 
				opts.username == 'myUsername' &&
				opts.password == 'myPassword' &&
				opts.path == 'my/path');
	});
	
	it('should return with exit code 1 if invalid parameters', function(done){
		var spawn = require('child_process').spawn;
		var program = spawn('bin/noderunner',invalidArgs.split(' '));
		program.on('exit',function(code) {
			assert(code,1, 'Exit code should equal 1');
			done();
		});
	});
});