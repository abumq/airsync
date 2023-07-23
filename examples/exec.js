const { exec } = require('../src');
const { queryAccountInfo, queryUserInfo, snooze } = require('./example-utils');



const queryProfile = async () => {
  await snooze(10)
  return { id: 1, name: 'Majid Q.', role: 'Software Engineer' }
}

const querySocial = async () => {
  await snooze(10)
  return { github: 'abumq', linkedin: 'abumq' }
}

const flattenProfile = (profile, social) => {

  return {
    ...profile,
    ...social,
  }
}

(async () => {
  const userProfile = await exec(flattenProfile, queryProfile(), querySocial());
  console.log(userProfile);
})()
