// ATTENTION!!
// jjson and spread are still under development
// they should not be used in production

const { json, spread, fn } = require('../src');
const exampleUtils = require('./example-utils');

const queryUserInfo = fn(exampleUtils.queryUserInfo);
const queryAccountInfo = fn(exampleUtils.queryAccountInfo);

const accountInfo = queryAccountInfo(queryUserInfo());

const other = async () => {
  return {
    name: 'abumq',
  }
}

(async () => {
  const r = await json({
    accountInfo,
    [spread()]: queryAccountInfo(queryUserInfo()),
    [spread()]: other(),
  });

  console.log(r);

})();
