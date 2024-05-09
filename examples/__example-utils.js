const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

const queryUserInfo = async () => {
  //await snooze(800);
  return {
    name: 'John',
    dob: '25/03/1986',
  };
};

const queryAccountInfo = async (user) => {
  //await snooze(500);
  return {
    preferences: 32,
    permissions: 7,
    user,
  };
};

const thisFnThrows = async (doThrow = true) => {
  if (doThrow) {
    throw new Error('thisFnThrows Error');
  }

  return 123;
};

const simple = () => {
  return 'abc';
};

// example of independant
const querySystemInfo = async () => {
  //await snooze(200);
  return {
    load: 14.0,
  };
};

// example of promise
const queryConfig = (sender) => new Promise(async (resolve) => {
  //await snooze(300);
  resolve({
    url: 'https://amrayn.com',
    sender,
  });
});

// runs a function
const runExample = (f) => {
  const start = Date.now()
  f().then((result) => {
    const timeTaken = (Date.now() - start)
    const timeTakenEst = Math.round(timeTaken / 50) * 50
    console.log(`---- ${f.name}() ---`)
    console.log(`Time to finish: ${timeTakenEst}ms`)
    console.log(result)
    console.log('\n')
  })
}

module.exports = {
  querySystemInfo,
  queryUserInfo,
  queryAccountInfo,
  thisFnThrows,
  queryConfig,
  simple,
  snooze,
  runExample,
};
