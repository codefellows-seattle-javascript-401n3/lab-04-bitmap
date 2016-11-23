'use strict';

const fs = require('fs');

function BitmapImage() {
  this.loaded = false;
}

BitmapImage.prototype.load = function(file, onLoad) {
  this.file = file;
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    this.type = (String.fromCharCode(data[0]) + String.fromCharCode(data[1]));
    if (this.type != 'BM') {
      throw new Error('Invalid bitmap type.');
    }
    this.size = data.readUInt32LE(2);
    this.dataOffset = data.readUInt32LE(10);
    this.width = data.readUInt32LE(18);
    this.height = data.readUInt32LE(22);
    this.bpp = data.readUInt32LE(28);
    this.data = data;
    this.loaded = true;
    onLoad(this);
  });
};

BitmapImage.prototype.transform = function(newFile, callback, transformation) {
  let offset = this.dataOffset;
  let newData = new Buffer(this.data);
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      let b = newData[offset] = transformation(2, newData[offset++]);
      let g = newData[offset] = transformation(1, newData[offset++], b);
      newData[offset] = transformation(0, newData[offset++], g);
    }
    offset += (this.width % 4);
  }
  fs.writeFile(newFile, newData, callback);
};

BitmapImage.prototype.invert = function(newFile, callback) {
  this.transform(newFile, callback, function(color, input) {
    return 255 - input;
  });
};

BitmapImage.prototype.greyscale = function(newFile, callback) {
  this.transform(newFile, callback, function(color, input, prev) {
    if (prev)
      return prev; //Not my proudest hackfix, but it works
    return input;
  });
};

BitmapImage.prototype.multiplyColor = function(newFile, options, callback) {
  this.transform(newFile, callback, function(color, input) {
    if (options[color])
      return Math.min(255, input * options[color]);
    else
      return input;
  });
};

module.exports = BitmapImage;
