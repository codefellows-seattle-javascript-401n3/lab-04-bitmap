'use strict';

const BMP = require('../lib/bitmapimage');
const assert = require('assert');

let bmp = new BMP();

describe('BitmapImage', function() {
  describe('#load()', function() {
    it('should read the bitmap data and assign it to the bitmap object', function(done) {
      bmp.load('./test/test.bmp', function() {
        if (bmp.data) {
          done();
        } else {
          done(new Error('No bitmap data detected.'));
        }
      });
    });
  });
});
