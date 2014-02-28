var RSVP = require('rsvp')

module.exports = function promiseMapSeries (arr, iterator, thisArg) {
  return RSVP.Promise.all(arr)
    .then(function (arr) {
      var results = new Array(arr.length)
      var index = 0
      return arr.reduce(function (promise, item) {
          return promise.then(function () {
              return iterator.call(thisArg, item, index, arr)
            })
            .then(function (result) {
              results[index++] = result
            })
        }, RSVP.resolve())
        .then(function () {
          return results
        })
    })
}
