var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var path = require('path');

describe('Noderunner',function(){		
	
	var Noderunner;
	
	beforeEach(function(){
		Noderunner = rewire('../src/noderunner');
	});
	
	describe('#constructor', function(){
		it('should throw exception if opts or update manager are null/undefined', function(){
			assert.throws(function(){
				new Noderunner(null,{});
			}, 'Allowed opts to be null/undefined');
			assert.throws(function(){
				new Noderunner({}, null);
			}, 'Allowed update manager to be null/undefined');
		});
	});
	
	describe('start', function(){				
		
		var noderunner;
		var osTmpdir = "/tmp";
		var noderunnerDirname = "noderunner";
		
		beforeEach(function(){
			noderunner = new Noderunner({name: "test"},{});
			
			var mkdirSync = sinon.spy();
			var os = {tmpDir : function(){ return osTmpdir }}
			var fs = { existsSync : sinon.stub(),
			 						   mkdirSync : sinon.stub()};
			
			Noderunner.__set__("os", os);
			Noderunner.os = os;
	        Noderunner.__set__("fs", fs);
			Noderunner.fs = fs;
		});
		
		it('should ensure that dir <noderunner> exists under os tmpdir', function(){			
			noderunner.start();
			assert(Noderunner.fs.mkdirSync.calledWith(path.join(osTmpdir,noderunnerDirname)));
		});
		
		it('should ensure that app tmpdir exists under noderunner tmpdir', function(){
			Noderunner.fs.existsSync.withArgs(path.join(osTmpdir,noderunnerDirname)).returns(true);
			Noderunner.fs.existsSync.withArgs(path.join(path.join(osTmpdir,noderunnerDirname),'test')).returns(false);
			noderunner.start();
			assert(Noderunner.fs.mkdirSync.calledWith(path.join(path.join(osTmpdir,noderunnerDirname),'test')));
		});
		
		it('should start process if temp folder contains package.json');
		it('should get latest version if temp folder is empty');
		it('should signal termination');
	});
});