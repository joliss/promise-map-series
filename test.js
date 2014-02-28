var test = require('tape')
var RSVP = require('rsvp')
var mapSeries = require('./index')

function addOne (item) { return item + 1 }

test('mapSeries', function (t) {
  t.test('accepts values and promises in the array', function (t) {
    var arr = [1, RSVP.resolve(2)]
    mapSeries(arr, addOne).then(function (results) {
      t.deepEqual(results, [2, 3])
      t.end()
    })
  })

  t.test('iterator is called in sequence for each item', function (t) {
    var seq = 0
    t.plan()
    mapSeries([0, 1], function (item) {
        t.equal(seq, item)
        return new RSVP.Promise(function (resolve, reject) {
          setTimeout(function () {
            t.equal(seq++, item)
            resolve(item === 0 ? 'foo' : 'bar')
          }, 10)
        })
      })
      .then(function (results) {
        t.equal(seq, 2)
        t.deepEqual(results, ['foo', 'bar'])
        t.end()
      })
  })

  t.test('is rejected on first rejection', function (t) {
    t.plan(2)
    var errorObject = new Error('rejected')
    mapSeries([0, 1], function (item) {
        t.pass('is called once')
        throw errorObject
      })
      .then(function () {
        t.fail('promise should be rejected')
      }, function (err) {
        t.equal(err, errorObject)
      })
  })

  t.test('is rejected immediately if array contains rejected promise', function (t) {
    mapSeries([RSVP.reject('foo')], function (item) {
        t.fail('iterator should not be called')
      })
      .then(function () {
        t.fail('should be rejected')
      }, function (err) {
        t.equal(err, 'foo')
        t.end()
      })
  })

  t.test('passes index and array argument to iterator', function (t) {
    t.plan(5)
    mapSeries([RSVP.resolve(42), 43], function (item, index, arr) {
      t.equal(item, index + 42)
      t.deepEqual(arr, [42, 43])
    }).then(function (results) {
      t.deepEqual(results, [undefined, undefined])
    })
  })

  t.test('accepts optional thisArg argument', function (t) {
    t.plan(2)
    var obj = {}
    mapSeries([0], function (item) {
      t.equal(this, global)
    })
    mapSeries([0], function (item) {
      t.equal(this, obj)
    }, obj)
  })
})
