const { convertFn } = require('../src');
const exampleUtils = require('./__example-utils');

const queryUserInfo = convertFn(exampleUtils.queryUserInfo);
const queryAccountInfo = convertFn(exampleUtils.queryAccountInfo, {
  debug: true,
  startTime: (name, desc) => {
    console.log('startTime for %s', name);
  },
  endTime: (name) => {
    console.log('endTime for %s', name);
  },
});

queryAccountInfo(queryUserInfo()).then(console.log)

/*
output
-----------------------------------

startTime for undefined
airsync: Resolving <unnamed>: {
  "preferences": 32,
  "permissions": 7,
  "user": {
    "name": "John",
    "dob": "25/03/1986"
  }
}
endTime for undefined
{
  preferences: 32,
  permissions: 7,
  user: { name: 'John', dob: '25/03/1986' }
}
*/