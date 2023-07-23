const airsync = require('../src')
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

const enableLog = false
const log = (...msg) => enableLog && console.log(...msg)

// takes ~50ms to return result
const getName = async (first, last = '') => {
  log('getName()', first, last)
  await snooze(50)
  return `${first}${last ? ` ${last}` : ''}`
}
const getNameAir = airsync.fn(getName) // specially crafted function definition

// takes ~150ms to return result
const queryName = async (n) => {
  log('queryName()', n)
  await snooze(150)
  return n
}

// runs a function
const run = (f) => {
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

const run1 = async () => ({
  king: await getName('Mansa', queryName('Musa')), // notice second param of getName() is promise
  minister: await getName(queryName('Mari'), queryName('Djata')), // both params of getName() is promise
})

const run2 = async () => ({
  king: await getName('Mansa'),
  minister: await getName('Mari'),
})

const run3 = async () => airsync.json({ // using airsync
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

const run6 = async () => airsync.json({ // using airsync
  king: getNameAir('Mansa', queryName('Musa')),
  minister: getNameAir( queryName('Mari'), queryName('Djata')),
})

run(run1)
run(run2)
run(run3) // fastest because of airsync

run(run4)
run(run5)
run(run6)