'use strict';

let sizeOf = require('image-size');
let ExifImage = require('exif').ExifImage;
let KindaObject = require('kinda-object');

let KindaImageInfo = KindaObject.extend('KindaObject', function() {
  this.creator = function(path) {
    this.path = path;
  };

  this.get = async function() {
    let exifData = await new Promise(function(resolve, reject) {
      new ExifImage({ image: this.path }, function(err, res) { // eslint-disable-line no-new
        if (err) reject(err); else resolve(res);
      });
    }.bind(this));
    return this._get(exifData);
  };

  this.getSync = function() {
    let image = new ExifImage({ image: this.path });
    return this._get(image.exifData);
  };

  this._get = function(exifData) {
    let dimensions = sizeOf(this.path);
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
