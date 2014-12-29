var current = require('../');
var RSVP = require('rsvp');
var assert = require('assert');
var index = 0;
var input = new Array(10);

// populate input to prevent spare array which old merely skips over
for (var i = 0; i < input.length; i++) {
  input[i] = i;
}

function test(implementationPath) {
  var implementation = require(implementationPath);

  return function(deferred){
    implementation(input, function(item) {
      return new RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve(item);
        }, 10);
      });
    }).then(function(results) {
      assert.deepEqual(results, input, implementationPath);
      deferred.resolve();
    }).catch(function(reason) {
      console.error(reason);
      console.error(reason.stack);
    });
  };
}

//test(require(variationPath))({
//  resolve: function() {
//    console.log('done');
//  }
//});

require('./bench')([
  { name: 'current'      , fn: test('../') },
  { name: 'other'        , fn: test('./variations/index') },
  { name: 'old'          , fn: test('./variations/old') },
  { name: 'old-variation', fn: test('./variations/old-variation') }
]);
