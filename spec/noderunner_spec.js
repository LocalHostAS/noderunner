var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

describe('Noderunner',function(){		
	
	var Noderunner;
	
	beforeEach(function(){
		Noderunner = rewire('../src/noderunner');
		Noderunner.spawn = sinon.spy();
		Noderunner.__set__("spawn", Noderunner.spawn);
	});
	
	describe('constructor', function(){
		it('should throw exception if opts or update manager are null/undefined', function(){
			assert.throws(function(){
				new Noderunner(null,{});
			}, 'Allowed opts to be null/undefined');
			assert.throws(function(){
				new Noderunner({}, null);
			}, 'Allowed update manager to be null/undefined');
		});
	});
		
	describe('#start', function(){				

		var noderunner;
		var osTmpdir = "/tmp";
		var noderunnerDirname = "noderunner";
		
		beforeEach(function(){
			var updateManager = new EventEmitter();
			noderunner = new Noderunner({name: "test"},updateManager);
			
			var mkdirSync = sinon.spy();
			var os = {
				tmpDir : function(){ return osTmpdir }
			}
			var fs = { 
				existsSync : sinon.stub().returns(true),
				mkdirSync : sinon.stub()
			};
			
			
			Noderunner.__set__("os", os);
			Noderunner.os = os;
	        Noderunner.__set__("fs", fs);
			Noderunner.fs = fs;
		});
		
		describe('@event(newVersionAvailable)', function(){
			
			beforeEach(function(){
				var version = '1999-01-01';
				
				var jsonFileStub = sinon.stub();
				jsonFileStub.withArgs(path.join(version,'package.json'));
				jsonFileStub.yields([null,JSON.stringify({
					scripts : {start: "command arg1 arg2 arg3"}
				})]);
				
				Noderunner.fs.readFile = jsonFileStub;
				
				noderunner.start();
				noderunner.updateManager.emit('newVersionAvailable', version);
			});
			
			describe('when no version is running', function(){
				it('should start the new version by running npm start command in package.json', function(){
					assert(Noderunner.spawn.calledOnce, 'New process not spawned');
				});
			});
		});
		
		describe('when Noderunner has not been run before', function(){
			
			beforeEach(function(){
				Noderunner.fs.existsSync.withArgs(path.join(osTmpdir,noderunnerDirname)).returns(false);
				noderunner.start();
			});
			
			it('should create noderunner tmp dir under os tmp dir', function(){
				assert(Noderunner.fs.mkdirSync.calledWith(path.join(osTmpdir,noderunnerDirname)),
				"Noderunner tmp dir not created");
			});
			
		});
		
		describe('when node has not been run before', function(){
		
			beforeEach(function(){
				Noderunner.fs.existsSync.withArgs(path.join(path.join(osTmpdir,noderunnerDirname),'test')).returns(false);
				noderunner.start();
			});
		
			it('should create app dir inside noderunner tmp dir', function(){
				assert(Noderunner.fs.mkdirSync.calledWith(path.join(path.join(osTmpdir,noderunnerDirname),'test')));
			});
		});
						
		it('should start listening for update events', function(){
			noderunner.start();
			assert(noderunner.updateManager.listeners('newVersionAvailable').length == 1, 'Not listening for update events');
			
		});
	});
	
	describe('Hahahahaah', function(){});
});