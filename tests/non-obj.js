const assert = require('assert');
const airsync = require('../src');

it('Non object values', async () => {
  const result = await airsync.resolve(123);
  assert.equal(result, 123);
});


it('Non object promise', async () => {
  const result = await airsync.resolve(Promise.resolve(123));
  assert.equal(result, 123);
});
