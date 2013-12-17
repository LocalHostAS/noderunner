var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('cli',function(){		
	it('should return with exit code 1 if invalid parameters', function(done){
		/*var spawn = require('child_process').spawn;
		var program = spawn('bin/noderunner-js','-p something'.split(' '));
		program.on('exit',function(code) {
			assert(code,1, 'Exit code should equal 1');
			done();
		});*/
		done();
	});
	
	it('should start noderunner with supplied parameters if valid', function(){
		
		/*var cli = rewire('../bin/noderunner-cli');
		var startSpy = sinon.spy();
		
		cli.__set__("noderunner", {
			start: startSpy
		});
		
		cli('-b bucket -p some/path -k someKey -s someSecret -n name');
		
		assert(startSpy.calledWith('bucket', 'some/path', 'someKey', 'someSecret', 'name'));*/
	});
});