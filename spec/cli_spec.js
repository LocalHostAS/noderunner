var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('cli',function(){		
	it('should return with exit code 1 if incorrect parameters are passed', function(done){
		var spawn = require('child_process').spawn;
		var program = spawn('bin/noderunner-js','-p something'.split(' '));
		program.on('exit',function(code) {
			assert(code,1, 'Exit code should equal 1');
			done();
		});
	});
	
	it('should start noderunner with supplied parameters if valid', function(){
		
		var cli = rewire('../bin/noderunner-js');
		var startSpy = sinon.spy();
		
		cli.__set__("noderunner", {
			start: startSpy
		});
		
		cli('-p some/path -s someSecret -k someKey');
		
		assert(startSpy.calledWith('some/path', 'someKey', 'someSecret'));
	});
});