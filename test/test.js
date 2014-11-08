var eventually = require("../index.js"),
    assert = require('assert');

describe('Eventually', function(){
  describe('Defaults', function(){
    it('should start with an elapsed value o 0', function(){
      assert.equal(0, eventually.elapsed);
    });

    it('should have an empty registry object', function(){
      assert.deepEqual(eventually.registry, {});
    });

    it('should have a default timeout of 4000', function(){
      assert.equal(eventually.defaults.timeout, 4000);
    });
  });

  describe('Customizations', function(){
    it('should have an no customizations', function(){
      assert.deepEqual(eventually.customizations, {});
    });

    it('should have a default timeout of 4000', function(){
      assert.equal(eventually.defaults.timeout, 4000);
    });

    it('should allow setting a timeout', function(){
      assert.equal(eventually.customizations.timeout, null);
      eventually.timeout(69);
      assert.equal(eventually.customizations.timeout, 69);
    });

    describe('#timeoutValue', function() {
      it('should return the default of no customization is set', function(){
        assert(eventually.timeoutValue(), eventually.defaults.timeout);
      });

      it('should return the customization if set', function(){
        eventually.timeout(23);
        assert(eventually.timeoutValue(), 23);
      });
    });
  });

  describe('#expect', function(){
    it('should add the expectation to the registry', function(){
      assert.deepEqual(eventually.registry, {});
      eventually.expect("jordan", function(bucket) {});
      assert.equal(eventually.registry.hasOwnProperty("jordan"), true);
    });

    it('should return a promise', function(){
      var promise = eventually.expect("pippen", function(bucket) {});

      assert.equal(promise.then  !== undefined, true);
      assert.equal(promise.done  !== undefined, true);
      assert.equal(promise.catch !== undefined, true);
    });
  });

  describe('#receive', function(){
    it('should add the feature and value to buckets if missing', function(){
      assert.deepEqual(eventually.buckets, {});
      eventually.receive("jordan", 23);
      assert.deepEqual(eventually.buckets, { "jordan" : 23 });
    });
  });
});
