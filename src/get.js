const lodashGet = require('lodash.get'); // peer depedency
const { fn } = require('./fn');

const get = (objOrPromise, path, defaultVal, options = {}) => fn(o => lodashGet(o, path) || defaultVal, options)(objOrPromise)

module.exports.get = get;
