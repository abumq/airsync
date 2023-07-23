const assert = require('assert');
const lodashGet = require('lodash.get');
const { fn } = require('../src');

const { getResponse } = require('./utils');

const get = (objOrPromise, path, defaultVal, options = {}) => fn(o => lodashGet(o, path) || defaultVal, options)(objOrPromise)

describe('Test get', () => {
  it('Get resolves to correct value', async () => {
    const r = await get(getResponse(), 'status')
    assert.equal(r, 200)
  });

  it('Exception handled correctly', async () => {
    try {
      const r = await get(getResponse(true), 'status');
      assert.fail()
    } catch (e) {
      assert.equal(e.message, 'Thrown intentionally')
    }
  });

  it('Default values are resolved correctly', async () => {
    const r = await get(getResponse(), 'non-existant', 500)
    assert.equal(r, 500)
  });

  it('get options work correctly', async () => {
    const timerResult = { start: false, end: false };

    const r = await get(getResponse(), 'status', undefined, {
      startTime: () => timerResult.start = true,
      endTime: () => timerResult.end = true,
    })

    assert.equal(r, 200)
    assert.equal(timerResult.start, true);
    assert.equal(timerResult.end, true);
  });
});
