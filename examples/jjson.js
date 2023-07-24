// ATTENTION!!
// jjson and spread are still under development
// they should not be used in production

const { fn } = require('../src');
const { jjson, spread } = require('../src/spread+jjson');
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
  const r = await jjson({
    accountInfo,
    [spread()]: queryAccountInfo(queryUserInfo()),
    [spread()]: other(),
  });

  console.log(r);

})();
