const { json } = require('../src');

(async () => {
  console.clear()
  const uint8ArrayItem = new Uint8Array([21, 31])
  const resultObj = await json({
    uint8ArrayItem,
  })
  const resultArr = await json(
    uint8ArrayItem
  )
  console.log(resultArr)
  console.log(resultObj)
})()
