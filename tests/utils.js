const airsync = require('../src');

const buildPerson_ = (details) => Promise.resolve(details);

const queryPerson_ = () => buildPerson_({
  id: 1,
  name: 'John',
  age: 85,
  height: 173,
  weight: 70,
});

const queryDetails_ = (person) => Promise.resolve({
  description: `His name is ${person.name} (${person.id})`,
  ageDescription: `Age is ${person.age}`,
});

const queryProfile_ = (person) => Promise.resolve({
  height: `This person is ${person.height} cm tall`,
  weight: `This person is ${person.weight} kg in weight`,
});

const queryCompany_ = () => Promise.resolve({
  name: 'Amrayn Web Services',
  department: 'IT',
});

const getResponse_ = (doThrow = false) => doThrow ? Promise.reject('Thrown intentionally') : Promise.resolve({
  status: 200,
});

module.exports.buildPerson = airsync.convertFn(buildPerson_);
module.exports.queryPerson = airsync.convertFn(queryPerson_);
module.exports.queryProfile = airsync.convertFn(queryProfile_);
module.exports.queryDetails = airsync.convertFn(queryDetails_);
module.exports.queryCompany = airsync.convertFn(queryCompany_);
module.exports.getResponse = airsync.convertFn(getResponse_);
