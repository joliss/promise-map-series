var RSVP = require('rsvp');

module.exports = function promiseMapSeries (array, iterator, thisArg) {
  var results = new Array(array.length)
  var index = 0
  var cb = arguments.length > 2 ? iterator.bind(thisArg) : iterator

  return array.reduce(function (promise, item) {
      return promise.then(function () {
          return cb(item, index, array)
        })
        .then(function (result) {
          results[index++] = result
        })
    }, RSVP.resolve())
    .then(function () {
      return results
    })
}
