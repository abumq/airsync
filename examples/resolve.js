const { exportFns, resolve } = require('../src');
const originalExamples = require('./__example-utils');

const exampleUtils = exportFns(originalExamples)

const generateObj = (err = false) => {
  const userInfo = exampleUtils.queryUserInfo();
  const accountInfo = exampleUtils.queryAccountInfo(userInfo);
  const systemInfo = exampleUtils.querySystemInfo();
  const config = exampleUtils.queryConfig('web');
  const simple = exampleUtils.simple();
  const withoutErr = err ? exampleUtils.thisFnThrows()
    .catch(err => console.log('This was thrown to show you how to catch errors', err.message)) : null;

  return resolve({
    title: 'example',
    account: accountInfo,
    systemInfo,
    simple,
    config,
    withoutErr,
    exc: [
      1, 2, exampleUtils.thisFnThrows(false)
    ],
  });
};

generateObj().then(console.log);

/*
output:

{
  title: 'example',
  account: {
    preferences: 32,
    permissions: 7,
    user: { name: 'John', dob: '25/03/1986' }
  },
  systemInfo: { load: 14 },
  simple: 'abc',
  config: { url: 'https://amrayn.com', sender: 'web' },
  withoutErr: null,
  exc: [ 1, 2, 123 ]
}
*/