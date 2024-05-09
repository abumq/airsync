const { resolve, spread, convertFn } = require('../src');
const exampleUtils = require('./__example-utils');

const queryUserInfo = convertFn(exampleUtils.queryUserInfo);
const queryAccountInfo = convertFn(exampleUtils.queryAccountInfo);

const accountInfo = queryAccountInfo(queryUserInfo());

const other = async () => {
  return {
    name: 'abumq',
  }
}

resolve({
  accountInfo,
  [spread()]: queryAccountInfo(queryUserInfo()),
  [spread()]: other(),
}).then(console.log)

/*
output
-----
{
  accountInfo: {
    preferences: 32,
    permissions: 7,
    user: { name: 'John', dob: '25/03/1986' }
  },
  preferences: 32,
  permissions: 7,
  user: { name: 'John', dob: '25/03/1986' },
  name: 'abumq'
}
*/