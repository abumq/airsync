const assert = require('assert');
const airsync = require('../src');

const p = async v => v;

describe('Typed arrays are resolved correctly', () => {

  describe('Uint8Array', async () => {
    const result = await airsync.json({
      uint8Array: new Uint8Array([21, 31]),
      promiseBasedUint8Array: (async () => new Uint8Array([21, 31]))(),
      arr: {
        simpl: new Uint8Array([21, 31]),
      },
    });

    it('Uint8Array is resolved correctly', () => {
      assert.deepEqual(result.uint8Array, [21, 31]);
    });

    it('promise based Uint8Array is resolved correctly', () => {
      assert.deepEqual(result.promiseBasedUint8Array, new Uint8Array([21, 31]));
    });
  });
});
