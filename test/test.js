'use strict';

let pathModule = require('path');
let assert = require('chai').assert;
let KindaImageInfo = require('../src');

suite('KindaImageInfo', function() {
  test('get()', async function() {
    let path = pathModule.join(__dirname, 'space-invader.jpg');
    let imageInfo = KindaImageInfo.create(path);
    let info = await imageInfo.get();
    assert.deepEqual(info, { width: 243, height: 200, resolution: 169.333 });
  });

  test('getSync()', function() {
    let path = pathModule.join(__dirname, 'space-invader.jpg');
    let imageInfo = KindaImageInfo.create(path);
    let info = imageInfo.getSync();
    assert.deepEqual(info, { width: 243, height: 200, resolution: 169.333 });
  });
});
