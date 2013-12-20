var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('cli',function(){
	it('should accept arguments name, source=s3, bucket, path, key, and secret, and pass them along to noderunner.start() as an object', function(){
		
		// Setup
		var cli = rewire('../bin/noderunner');
        var startSpy = sinon.spy();                
        cli.__set__("noderunner", { start: startSpy });
		
		// Act
		cli('--name=myApp --source=s3 --bucket=myBucket --path=my/path --key=myKey --secret=mySecret');
		
		// Assert
		assert(startSpy.calledOnce);
		var opts = startSpy.getCall(0).args[0];
		assert(opts.name == 'myApp' && 
				opts.source == 's3' && 
				opts.bucket == 'myBucket' && 
				opts.path == 'my/path' &&
				opts.key == 'myKey' &&
				opts.secret == 'mySecret');
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
		var program = spawn('bin/noderunner','--source=something --argh=meuw'.split(' '));
		program.on('exit',function(code) {
			assert(code,1, 'Exit code should equal 1');
			done();
		});
	});
});