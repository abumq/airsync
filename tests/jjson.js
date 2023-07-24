const assert = require('assert');
const airsync = require('../src');

const { queryPerson, queryProfile } = require('./utils');

describe('When we have JSON', async () => {
  
  const buildProps = () => {

    const person = queryPerson();
    const profile = queryProfile(person);

    return airsync.jjson({
      [airsync.spread()]: person,
      profile: {
        profileDetails: profile,
      },
    });
  }

  const props = await buildProps();

  it('the JJSON correctly spreads the properties', () => {
    assert.equal(props.id, 1);
    assert.equal(props.name, 'John');
    assert.equal(props.age, 85);
    assert.equal(props.height, 173);
    assert.equal(props.weight, 70);
  });

  it('the non-spreaded fields are produced', () => {
    assert.deepEqual(props.profile.profileDetails, {
      height: `This person is 173 cm tall`,
      weight: `This person is 70 kg in weight`,
    });
  });
});

