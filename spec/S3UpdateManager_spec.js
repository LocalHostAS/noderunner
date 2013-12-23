var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');

describe('S3UpdateManager', function(){
	describe('#constructor', function(){
		
		var S3UpdateManager;
		
		beforeEach(function(){
			S3UpdateManager = rewire('../src/S3UpdateManager');
		});
		
		it('should throw exception if bucket, path, key, or secret is missing from options', function(){
			
			// Act
			try {
				new S3UpdateManager({
					path: 'myPath',
					key: 'myKey',
					secret: 'mySecret'
				});
				assert(false, 'Allowed bucket to be null/undefined');
			} catch (ex) {
				assert(true);
			}
			
			try {
				new S3UpdateManager({
					bucket: 'myBucket',
					key: 'myKey',
					secret: 'mySecret'
				});
				assert(false, 'Allowed path to be null/undefined');
			} catch (ex) {
				assert(true);
			}
			
			try {
				new S3UpdateManager({
					bucket: 'myBucket',
					path: 'myPath',
					secret: 'mySecret'
				});
				assert(false, 'Allowed key to be null/undefined');
			} catch (ex) {
				assert(true);
			}
			
			try {
				new S3UpdateManager({
					bucket: 'myBucket',
					path: 'myPath',
					key: 'myKey'
				});
				assert(false, 'Allowed secret to be null/undefined');
			} catch (ex) {
				assert(true);
			}
			
		});
	});
});

