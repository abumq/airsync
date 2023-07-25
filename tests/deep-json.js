const assert = require('assert');
const { json } = require('../src');

describe('When we have JSON with deep promiss', async () => {
  const item = async () => 1
  const jsonItem = () => json({
    result: item()
  })
  const jsonItemAsync = async () => {
    return {
      result: json({
        result: item()
      })
    }
  }
  const itemAsync = async () => {
    return {
      result: {
        result: item()
      }
    }
  }
  const produce = async () => {
    return json({
      depth1_1: item(),
      depth1_2: {
        result: item(),
      },
      depth1_3: json({
        result: item(),
      }),
      depth1_4: jsonItem(),
      depth1_5: jsonItemAsync(),
      depth1_6: itemAsync(),

    })
  }
  const result = await produce();

  it('depth 1 is correctly resolved', () => {
    assert.equal(result.depth1_1, 1);
  });

  it('depth 2 is correctly resolved', () => {
    assert.equal(result.depth1_2.result, 1);
  });

  it('depth 1 with JSON is correctly resolved', () => {
    assert.equal(result.depth1_3.result, 1);
  });

  it('depth 4 with json() call is correctly resolved', () => {
    assert.equal(result.depth1_4.result, 1);
  });

  it('depth 5 with async json() call is correctly resolved', () => {
    assert.equal(result.depth1_5.result.result, 1);
  });

  it('depth 5 with async non-json() call is correctly resolved', () => {
    assert.equal(result.depth1_6.result.result, 1);
  });
});
