// Copyright (c) 2020-present @abumq (Majid Q.)
//
// https://github.com/abumq/airsync
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const exec = (optOrFn, ...args) => {
  let options = {};

  const func = typeof optOrFn === 'function' ? optOrFn : args[0];

  if (typeof func !== 'function') {
    throw new TypeError(`${func} is not a function`);
  }

  if (typeof optOrFn === 'object') {
    // we need shift args by one as first paramter is "options"
    // second is function
    // and rest are arguments
    args.shift();
    // options may be overridden
    options = {
      ...(optOrFn || {}),
      ...(func._airsyncOptions || {}),
    };
  } else {
    // options may be overridden
    options = {
      ...(optOrFn._airsyncOptions || {}),
    };
  }
  if (!options.name && func.name !== '') {
    options.name = func.name;
  }
  if (typeof options.startTime === 'function') {
    options.startTime(options.name, options.description);
  }
  const argsAsPromises = args.map(curr => Promise.resolve(curr));
  return Promise.all(argsAsPromises).then(async results => {
    try {
      const finalResult = await Promise.resolve(func(...results));
      if (options.debug) {
        const _logger = global.logger || console;
        try {
          _logger.debug('airsync: Resolving %s: %s', options.name || '<unnamed>', JSON.stringify(finalResult, null, 2));
        } catch (err) {
          _logger.debug('airsync: Resolving %s: %s', options.name || '<unnamed>', finalResult);
        }
      }
      return finalResult;
    } finally {
      if (typeof options.endTime === 'function') {
        options.endTime(options.name);
      }
    }
  }).catch(error => {
    if (typeof options.endTime === 'function') {
      options.endTime(options.name);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error);
  });
};

const fn = (func, opt = {}) => {
  if (typeof func !== 'function') {
    throw new TypeError(`${func} is not a function`);
  }
  const finalFunc = (...args) => exec(opt, func, ...args);
  finalFunc._isAirsync = true;
  finalFunc._airsyncOptions = opt || {};
  finalFunc.setOptions = ({ startTime, endTime, debug, name, description }) => {
    // we use destructured option instead of Object.keys in params for performance
    finalFunc._airsyncOptions.endTime = endTime || finalFunc._airsyncOptions.endTime;
    finalFunc._airsyncOptions.startTime = startTime || finalFunc._airsyncOptions.startTime;
    finalFunc._airsyncOptions.debug = debug || finalFunc._airsyncOptions.debug;
    finalFunc._airsyncOptions.name = name || finalFunc._airsyncOptions.name;
    finalFunc._airsyncOptions.description = description || finalFunc._airsyncOptions.description;
  }
  return finalFunc;
};

const fnExport = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  return Object.keys(obj).reduce((accum, curr) => ({
    ...accum,
    [curr]: (!obj[curr] || obj[curr]._isAirsync || typeof obj[curr] !== 'function')
      ? obj[curr] : fn(obj[curr]),
  }), {});
};

module.exports.fn = fn;
module.exports.fnExport = fnExport;
module.exports.exec = exec;
