const assert = require('assert');
const airsync = require('../src');

describe('Test fn with json like params', () => {

  describe('Given a sync function', () => {
    const myfn = ({ p1, p2 }) => `result => ${p1} & ${p2}`;

    it('Returns correct result from sync', () => {
      assert.equal(myfn({ p1: 'abumq', p2: 'Majid Q.' }), 'result => abumq & Majid Q.');
    })

    it('Returns in correct result from promise param', () => {
      assert.notEqual(myfn({ p1: 'abumq', p2: Promise.resolve('Majid Q.') }), 'result => abumq & Majid Q.');
    })

    describe('When converted to async', () => {
      const myfnAsync = airsync.convertFn(myfn);

      it('Returns same result without promises', async () => {
        assert.equal(await myfnAsync({ p1: 'abumq', p2: 'Majid Q.' }), 'result => abumq & Majid Q.');
      })

      it('Returns same result with promises', async () => {
        assert.equal(await myfnAsync({ p1: 'abumq', p2: Promise.resolve('Majid Q.') }), 'result => abumq & Majid Q.');
      })
    })
  })
});
