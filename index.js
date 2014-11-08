(function(module){
  'use strict';

  var Q = require("q");

  var Eventually = {
    registry: {},
    uuid: "",
    elapsed: 0,
    buckets: {},
    customizations: {},
    defaults: { timeout: 4000 },

    timeout: function(time) {
      this.customizations["timeout"] = time;
      return this;
    },

    timeoutValue: function() {
      return this.customizations.timeout || this.defaults.timeout;
    },

    startTimeoutCounter: function(deferred) {
      var lock =  setTimeout(function() {
        deferred.reject('timeout');
      }, this.timeoutValue());

      this.customizations = {};
      return lock;
    },

    expect: function(feature, doneCallback) {
      if ( feature in this.buckets ) {

        return Q.when(doneCallback(this.buckets[feature]));

      } else {

        var deferred = Q.defer();

        deferred.promise.then(doneCallback);

        this.registry[feature] = {
          deferred: deferred,
          timeout: this.startTimeoutCounter(deferred)
        };
        return this.registry[feature].deferred.promise;
      }
    },

    receive: function(feature, value) {
      if ( this.buckets[feature] == null ) {
        this.buckets[feature] = value;
      }

      if ( feature in this.registry ) {
        clearTimeout(this.registry[feature].timeout);
        this.registry[feature].deferred.resolve(value);
        delete this.registry[feature];
      }
    }
  };

  module.exports = Eventually;
})(module);
