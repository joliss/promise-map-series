# promise-map-series

[![Build Status](https://travis-ci.org/joliss/promise-map-series.png?branch=master)](https://travis-ci.org/joliss/promise-map-series)

Call an iterator function for each element of an array in series, ensuring
that no iterator is called before the promise returned by the previous
iterator is fulfilled, in effect preventing parallel execution. Like
[async.mapSeries](https://github.com/caolan/async#mapseriesarr-iterator-callback),
but for promises.

## Installation

```bash
npm install --save promise-map-series
```

## Usage

```js
var mapSeries = require('promise-map-series')

mapSeries(array, iterator[, thisArg]).then(function (newArray) {
  ...
})
```

* **`array`**: An array of values, some or all of which may be promises.
  Waits for all promises to fulfill before running the `iterator` on the
  fulfillment values in sequence. If any are rejected, `mapSeries`
  immediately returns the first rejected promise it sees and does not call
  `iterator`.

* **`iterator`**: Function that returns a promise or a value for the new
  array. The `iterator` will be called once for each element. If `iterator`
  returns a promise, then `iterator` will only be called for the next element
  once that promise is fulfilled. If the promise is rejected or `iterator`
  throws an error, iteration will stop immediately and `mapSeries` returns a
  rejected promise. The `iterator` function receives three arguments:

    * **`item`**: The current item in the array.

    * **`index`**: The current index in the array.

    * **`fulfillmentValues`**: An array containing the fulfillment values
      corresponding to each element of the original `array`.

* **`thisArg`** (optional): Value to use as `this` when executing `iterator`.
