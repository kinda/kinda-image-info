'use strict';

let sizeOf = require('image-size');
let ExifImage = require('exif').ExifImage;
let KindaObject = require('kinda-object');

let KindaImageInfo = KindaObject.extend('KindaObject', function() {
  this.creator = function(path) {
    this.path = path;
  };

  this.get = async function() {
    let dimensions = await new Promise((resolve, reject) => {
      sizeOf(this.path, function(err, res) {
        if (err) reject(err); else resolve(res);
      });
    });
    let exifData = await new Promise((resolve, reject) => {
      new ExifImage({ image: this.path }, function(err, res) { // eslint-disable-line no-new
        if (err) reject(err); else resolve(res);
      });
    });
    return this._get(dimensions, exifData);
  };

  this.getSync = function() {
    let dimensions = sizeOf(this.path);
    let image = new ExifImage({ image: this.path });
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
