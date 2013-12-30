var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('FTPUpdateManager', function(){
	describe('#constructor', function(){
	
		var FTPUpdateManager;
		
		beforeEach(function(){
			FTPUpdateManager = rewire('../src/FTPUpdateManager');
		});
		
		it('should throw exception if host, username, password, or path is missing from options', function(){
		
			assert.throws(function(){
				new FTPUpdateManager({
					path: 'myPath',
					username: 'myUsername',
					password: 'myPassword'
				});
			}, 'Allowed host to be null/undefined');
			
			assert.throws(function(){
				new FTPUpdateManager({
					host: 'myHost',
					username: 'myUsername',
					password: 'myPassword'
				});
			}, 'Allowed path to be null/undefined');

			assert.throws(function(){
				new FTPUpdateManager({
					host: 'myHost',
					path: 'myPath',
					password: 'myPassword'
				});
			}, 'Allowed username to be null/undefined');
			
			assert.throws(function(){
				new FTPUpdateManager({
					host: 'myHost',
					path: 'myPath',
					username: 'myUsername'
				});
			},'Allowed password to be null/undefined');			
		});
	});
});