const { convertFn, resolve } = require('../src');
const exampleUtils = require('./__example-utils');

const queryUserInfo = convertFn(exampleUtils.queryUserInfo);
const queryAccountInfo = convertFn(exampleUtils.queryAccountInfo);

const accountInfo = queryAccountInfo(queryUserInfo());

resolve({ accountInfo }).then(console.log)

/*
output:
-----------------------------------

{
  accountInfo: {
    preferences: 32,
    permissions: 7,
    user: { name: 'John', dob: '25/03/1986' }
  }
}
*/