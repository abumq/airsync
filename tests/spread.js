const assert = require('assert');
const airsync = require('../src');
const { queryPerson, queryProfile } = require('./utils');

const RACE_NUMBERS = 10;

describe('When we have JSON with spread()', async () => {
  
  const buildProps = () => {

    const person = queryPerson();
    const profile = queryProfile(person);

    const raceTest = () => {
      const obj = {};
      for (let i = 0; i <= RACE_NUMBERS; ++i) {
        obj[`item-${i}`] = airsync.json({
          [airsync.spread()]: queryPerson(),
        })
      }
      return obj;
    }

    return airsync.json({
      [airsync.spread()]: person,
      profile: {
        profileDetails: profile,
      },
      [airsync.spread()]: raceTest(),
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

  it('No race condition', () => {
    for (let i = 0; i <= RACE_NUMBERS; ++i) {
      const raceItem = props[`item-${i}`];
      assert.equal(raceItem.name, 'John', `Race condition test - number ${i} name failed`);
      assert.equal(raceItem.age, 85, `Race condition test - number ${i} age failed`);
      assert.equal(raceItem.height, 173, `Race condition test - number ${i} height failed`);
      assert.equal(raceItem.weight, 70, `Race condition test - number ${i} weight failed`);
      assert.equal(raceItem.id, 1, `Race condition test - number ${i} id failed`);
    }
  });

  it('the non-spreaded fields are produced correctly', () => {
    assert.deepEqual(props.profile.profileDetails, {
      height: `This person is 173 cm tall`,
      weight: `This person is 70 kg in weight`,
    });
  });
});

