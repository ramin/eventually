(function(module){
  'use strict';
  var Q = require("q"),
      ObserverJS = require("observe-js");

  var Eventually = {
    registry: {},
    changedTimer: null,
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

    stopChangedTimer: function(){
      clearInterval(this.changedTimer);
    },

    startChangedTimer: function(){
      this.changedTimer = setInterval(function(){
        window.Platform.performMicrotaskCheckpoint();
      }, 400);
    },

    observe: function(observable) {
      var _this = this;

      this.buckets = new ObserverJS.ObjectObserver(observable);

      this.buckets.open(function(added, removed, changed, getOldValueFn) {
        for (var property in added) {
          _this.dispatch(property, added[property]);
        }
        _this.stopChangedTimer();
      });

      this.startChangedTimer();

      return this;
    },

    expect: function(feature, doneCallback) {
      if ( feature in this.buckets.value_) {
        console.log(feature);
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

    dispatch: function(feature, value) {
      if ( feature in this.registry ) {
        clearTimeout(this.registry[feature].timeout);
        this.registry[feature].deferred.resolve(value);
        delete this.registry[feature];
      }
    },

    receive: function(feature, value) {
      if ( this.buckets[feature] == null ) {
        this.buckets[feature] = value;
      }
    }
  };

  module.exports = Eventually;
})(module);
