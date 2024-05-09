const airsync = require('../src')
const { runExample } = require('./__example-utils')
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

const enableLog = false
const log = (...msg) => enableLog && console.log(...msg)

// takes ~50ms to return result
const getName = async (first, last = '') => {
  log('getName()', first, last)
  await snooze(50)
  return `${first}${last ? ` ${last}` : ''}`
}
const getNameAir = airsync.convertFn(getName) // specially crafted function definition

// takes ~150ms to return result
const queryName = async (n) => {
  log('queryName()', n)
  await snooze(150)
  return n
}

const run1 = async () => ({
  king: await getName('Mansa', queryName('Musa')), // notice second param of getName() is promise
  minister: await getName(queryName('Mari'), queryName('Djata')), // both params of getName() is promise
})

const run2 = async () => ({
  king: await getName('Mansa'),
  minister: await getName('Mari'),
})

const run3 = async () => airsync.resolve({ // using airsync
  king: getName('Mansa', queryName('Musa')),
  minister: getName( queryName('Mari'), queryName('Djata')),
})

// we are using getNameAir() instead of getName()
const run4 = async () => ({
  king: await getNameAir('Mansa', queryName('Musa')),
  minister: await getNameAir(queryName('Mari'), queryName('Djata')),
})

const run5 = async () => ({
  king: await getNameAir('Mansa'),
  minister: await getNameAir('Mari'),
})

const run6 = async () => airsync.resolve({ // using airsync
  king: getNameAir('Mansa', queryName('Musa')),
  minister: getNameAir( queryName('Mari'), queryName('Djata')),
})

runExample(run1) // 100ms
runExample(run2) // 100ms
runExample(run3) // 50ms

runExample(run4) // 200ms
runExample(run5) // 100ms
runExample(run6) // 400ms


/*
 output
 ------
 ---- run3() ---
Time to finish: 50ms
{
  king: 'Mansa [object Promise]',
  minister: '[object Promise] [object Promise]'
}


---- run1() ---
Time to finish: 100ms
{
  king: 'Mansa [object Promise]',
  minister: '[object Promise] [object Promise]'
}


---- run2() ---
Time to finish: 100ms
{ king: 'Mansa', minister: 'Mari' }


---- run5() ---
Time to finish: 100ms
{ king: 'Mansa', minister: 'Mari' }


---- run6() ---
Time to finish: 200ms
{ king: 'Mansa Musa', minister: 'Mari Djata' }


---- run4() ---
Time to finish: 400ms
{ king: 'Mansa Musa', minister: 'Mari Djata' } 
 */