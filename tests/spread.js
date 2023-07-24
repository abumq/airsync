const assert = require('assert');
const airsync = require('../src');
const { queryPerson, queryProfile } = require('./utils');

const RACE_NUMBERS = 100;

const logger = {
  startTime: console.log,
  endTime: console.log,
}

describe('When we have JSON with spread()', async () => {
  
  const buildProps = () => {

    const person = queryPerson();
    const profile = queryProfile(person);

    return airsync.json({
      [airsync.spread()]: person,
      profile: {
        profileDetails: profile,
      },
    });
  }

  const props = await buildProps();
  // console.log(props)

  it('the JSON correctly spreads the properties', () => {
    assert.equal(props.name, 'John');
    assert.equal(props.age, 85);
    assert.equal(props.height, 173);
    assert.equal(props.weight, 70);
    assert.equal(props.id, 1);
  });

  it('the non-spreaded fields are produced correctly', () => {
    assert.deepEqual(props.profile.profileDetails, {
      height: `This person is 173 cm tall`,
      weight: `This person is 70 kg in weight`,
    });
  });
});

