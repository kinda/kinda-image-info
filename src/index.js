'use strict';

let sizeOf = require('kinda-image-size');
let ExifImage = require('kinda-exif').ExifImage;
let KindaObject = require('kinda-object');

let KindaImageInfo = KindaObject.extend('KindaObject', function() {
  this.creator = function(pathOrBuffer) {
    this.pathOrBuffer = pathOrBuffer;
  };

  this.get = async function() {
    let dimensions;
    if (typeof this.pathOrBuffer === 'string') {
      dimensions = await new Promise((resolve, reject) => {
        sizeOf(this.pathOrBuffer, function(err, res) {
          if (err) reject(err); else resolve(res);
        });
      });
    } else {
      dimensions = sizeOf(this.pathOrBuffer);
    }
    let exifData = await new Promise((resolve, reject) => {
      new ExifImage({ image: this.pathOrBuffer }, function(err, res) { // eslint-disable-line no-new
        if (err) reject(err); else resolve(res);
      });
    });
    return this._get(dimensions, exifData);
  };

  this.getSync = function() {
    let dimensions = sizeOf(this.pathOrBuffer);
    let image = new ExifImage({ image: this.pathOrBuffer });
    return this._get(dimensions, image.exifData);
  };

  this._get = function(dimensions, exifData) {
    let width = dimensions.width;
    let height = dimensions.height;
    let resolution;
    if (exifData && exifData.image && exifData.image.XResolution) {
      resolution = exifData.image.XResolution;
      if (resolution !== exifData.image.YResolution) {
        throw new Error('different XResolution and YResolution is not supported');
      }
    } else {
      resolution = 72;
    }
    return { width, height, resolution };
  };
});

module.exports = KindaImageInfo;
