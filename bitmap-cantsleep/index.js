'use strict';

const BMP = require('./lib/bitmapimage');

let bmp = new BMP();

bmp.load('bitmap.bmp', function() {
  bmp.invert('inverted.bmp', function(err) {
    if (err) throw err;
    console.log('Done transforming and writing inverted image.');
  });
  bmp.greyscale('greyscale.bmp', function(err) {
    if (err) throw err;
    console.log('Done transforming and writing greyscaled image.');
  });
  bmp.multiplyColor('colormul.bmp', [1, 5, 1], function(err) {
    if (err) throw err;
    console.log('Done transforming and writing color mulitplied image.');
  });
});
