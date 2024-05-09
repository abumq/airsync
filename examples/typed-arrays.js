const { resolve } = require('../src');

(async () => {
  const uint8ArrayItem = new Uint8Array([21, 31])
  const resultObj = await resolve({
    uint8ArrayItem,
  })
  const resultArr = await resolve(uint8ArrayItem)
  console.log(resultArr)
  console.log(resultObj)
})()

/*
output
------

Uint8Array(2) [ 21, 31 ]
{ uint8ArrayItem: Uint8Array(2) [ 21, 31 ] }

*/