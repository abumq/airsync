const assert = require('assert');
const airsync = require('../src');

describe('Typed arrays are resolved correctly', () => {

  describe('Uint8Array', async () => {
    const uint8ArrayItem = new Uint8Array([21, 31]);
    const result = await airsync.json({
      uint8ArrayItem,
      promiseBasedUint8Array: (async () => new Uint8Array([21, 31]))(),
    });

    it('Type is correct', () => {
      assert.equal(result.uint8ArrayItem.constructor.name, uint8ArrayItem.constructor.name)
    });

    it('Uint8Array is resolved correctly', () => {
      assert.deepEqual(result.uint8ArrayItem, new Uint8Array([21, 31]));
    });

    it('promise based Uint8Array is resolved correctly', () => {
      assert.deepEqual(result.promiseBasedUint8Array, new Uint8Array([21, 31]));
    });
  });
});
