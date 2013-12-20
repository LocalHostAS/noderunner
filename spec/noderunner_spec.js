var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var path = require('path');

describe('noderunner',function(){		
	describe('start', function(){				
		it('should trow exception if opts are null/undefined', function(){
			
			// Setup
			var noderunner = rewire('../src/noderunner');
			
			// Act
			try
			{
				noderunner.start(null);
				assert(false);
			}
			catch (ex)
			{
				assert(ex.toString().match(/invalid options/gi));
			}
		});
		
		it('should ensure that dir <noderunner> exists under os tmpdir', function(){
			
			var osTmpdir = "/tmp";
			var noderunnerDirname = "noderunner";
			
			// Setup
			var noderunner = rewire('../src/noderunner');
			var mkdirSync = sinon.spy();
			noderunner.__set__("os", {tmpDir : function(){ return osTmpdir }});                
	        noderunner.__set__("fs", { existsSync : function(){return false},
			 						   mkdirSync : mkdirSync});
		
			// Act
			noderunner.start({name: 'test'});
		
			// Assert
			assert(mkdirSync.calledWith(path.join(osTmpdir,noderunnerDirname)));
			
		});
		
		it('should ensure that app tmpdir exists under noderunner tmpdir', function(){
			
			var osTmpdir = "/tmp";
			var noderunnerDirname = "noderunner";
			
			// Setup
			var noderunner = rewire('../src/noderunner');
			
			var os = {
				tmpDir : function(){ return osTmpdir; }
			}
			
			var fs = {
				existsSync: sinon.stub(),
				mkdirSync: sinon.stub()
			}
			
			noderunner.__set__("os", os);                
	        noderunner.__set__("fs", fs);
			
			fs.existsSync.withArgs(path.join(osTmpdir,noderunnerDirname)).returns(true);
			fs.existsSync.withArgs(path.join(path.join(osTmpdir,noderunnerDirname),'test')).returns(false);
		
			// Act
			noderunner.start({name: 'test'});
		
			// Assert
			assert(fs.mkdirSync.calledWith(path.join(path.join(osTmpdir,noderunnerDirname),'test')));
			
		});
		
		it('should start process if temp folder contains package.json');
		it('should get latest version if temp folder is empty');
		it('should signal termination');
	});
});