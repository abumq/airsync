const assert = require('assert');
const airsync = require('../src');

describe('Options test', () => {

  it('Preset options', () => {
    const runStatus = { started: false, finished: false };
    const myfunc = airsync.fn(async () => 1, {
      startTime: () => runStatus.started = true,
      endTime: () => runStatus.finished = true,
    });

    assert.equal(runStatus.started, false);
    assert.equal(runStatus.finished, false);

    myfunc().then(result => {
      assert.equal(result, 1);

      assert.equal(runStatus.started, true);
      assert.equal(runStatus.finished, true);
    })
  });

  it('Override options', async () => {
    const runStatus = { started: false, finished: false };
    const myfunc = airsync.fn(async () => 1, {
      name: 'myfunc',
      startTime: () => runStatus.started = true,
      endTime: () => runStatus.finished = true,
    });

    assert.equal(runStatus.started, false);
    assert.equal(runStatus.finished, false);
    assert.equal(myfunc._airsyncOptions.name, 'myfunc');

    myfunc.setOptions({
      name: 'newname',
      endTime: (name) => runStatus.finished = 'done_' + name,
    })

    assert.equal(myfunc._airsyncOptions.name, 'newname');

    const result = await myfunc();
    assert.equal(result, 1);

    assert.equal(runStatus.started, true);
    assert.equal(runStatus.finished, 'done_newname');
  });
});
