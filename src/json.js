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

const MAX_DEPTH = 64;

const ARRAY_TYPES = {
  'Array': Array,
  // TypedArray - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
  'Int8Array': Int8Array,
  'Uint8Array': Uint8Array,
  'Uint8ClampedArray': Uint8ClampedArray,
  'Int16Array': Int16Array,
  'Uint16Array': Uint16Array,
  'Int32Array': Int32Array,
  'Uint32Array': Uint32Array,
  'Float32Array': Float32Array,
  'Float64Array': Float64Array,
  'BigInt64Array': BigInt64Array,
  'BigUint64Array': BigUint64Array,
};

const TYPED_ARRAY_NAMES = Object.keys(ARRAY_TYPES);

// List of items that do not require
// any further resolution and must be returned
// as is.
const NO_RESOLUTION_CLASS_LIST = [
  'Date', 'Set', 'Map',

  'ArrayBuffer', 'SharedArrayBuffer',
  ...TYPED_ARRAY_NAMES,
];

let SPREAD_COUNTER = 0;
const SPREAD_KEY_NAME = '__airsync_special_key';

// if [].from() is available use that otherwise use constructor
const createArrInstance = (ArrayInstanceType, items) =>
  typeof ArrayInstanceType.from === 'function' ?
    ArrayInstanceType.from(items) : new ArrayInstanceType(...items);

// do not use Array.isArray as it won't resolve typed arrays
const isArrayType = o => o && !!ARRAY_TYPES[o.constructor.name];

const createArray = (arr, depth, currentKey, opts = {}) => {
  if (depth === MAX_DEPTH) {
    throw new Error(`Exceeded array depth supported by airsync ${depth} at ${currentKey}`);
  }

  if (!arr) {
    return Promise.resolve(arr);
  }

  const ArrayInstanceType = ARRAY_TYPES[arr.constructor.name] || Array;

  if (opts.name && typeof opts.startTime === 'function') {
    opts.startTime(opts.name, opts.description);
  }

  // Something to note here
  // Promise.all resolves it to Array instead of typed array
  // so we do not have a way to resolve correct array type at
  // top level
  return Promise.all(createArrInstance(ArrayInstanceType, arr.map(curr => {
    if (isArrayType(curr)) {
      return createArray(curr, depth + 1, currentKey);
    }

    const result = json(curr, opts);
    if (opts.name && typeof opts.endTime === 'function') {
      opts.endTime(opts.name);
    }
    return result;
  })))
  .catch(error => {
    if (opts.name && typeof opts.endTime === 'function') {
      opts.endTime(opts.name);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error);
  })
};

const createObject = (obj, depth, currentKey, opts = {}) => {

  if (depth === MAX_DEPTH) {
    throw new Error(`Exceeded object depth supported by airsync ${depth} at ${currentKey}`);
  }

  if (!obj) {
    return Promise.resolve(obj);
  }

  if (typeof obj === 'object' && typeof obj.then === 'function') {
    // inside promise
    return Promise.resolve(obj)
  }

  if (obj.constructor) {
    const constructorName = obj.constructor.name;
    if (NO_RESOLUTION_CLASS_LIST.some(f => f === constructorName)) {
      if (TYPED_ARRAY_NAMES.some(f => f === constructorName)) {
        return createArray(obj, 1, currentKey, opts);
      }
      return obj;
    }
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (opts.name && typeof opts.startTime === 'function') {
      opts.startTime(opts.name, opts.description);
    }
    return Promise.all(
      keys.map(key => createObject(obj[key], depth + 1, key))
    )
    .then(values => {
      if (opts.name && typeof opts.startTime === 'function') {
        opts.endTime(opts.name);
      }
      return keys.reduce((accum, key, idx) => {
        if (key.indexOf(SPREAD_KEY_NAME) === 0) {
          return {
            ...accum,
            ...values[idx],
          };
        };
        return {
          ...accum,
          [key]: values[idx],
        };
      }, {})
    })
    .catch(error => {
      if (opts.name && typeof opts.endTime === 'function') {
        opts.endTime(opts.name);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error);
    })
  }
  return obj;
};

/**
 * Create JSON from promises without extracting functions or multiple await
 * 
 * This can also create special JSON with spreaded values instead of keyed values.
 * This function is used alongside {@link spread} function
 * ```js
 *   const props = jjson({
 *     [spread()]: buildUserDetails(),
 *   })
 * ```
 * 
 * This will result in:
 * ```
 * {
 *   id: 123,
 *   username: 'abumq'
 * }
 * ```
 * whereas if we were to use usual `json()`
 * ```js
 *   const props = json({
 *     user: buildUserDetails(),
 *   })
 * ```
 * that would result in 
 * ```
 * {
 *   user: {
 *     id: 123,
 *     username: 'abumq'
 *   }
 * }
 * ```
 * @param {*} val Object or Array
 * @param {*} opts AirSync options. See https://github.com/abumq/airsync/tree/main#options
 * @returns Resulting JSON
 */
const json = (val, opts = {}) => {
  if (!val || val === null || typeof val !== 'object') {
    return val;
  }

  if (isArrayType(val)) {
    return createArray(val, 1, '<root array>', opts);
  }

  return createObject(val, 1, '<root>', opts);
};

/**
 * Flags the field to be spreaded in resulting JSON.
 */
const spread = () => SPREAD_KEY_NAME + ++SPREAD_COUNTER;

module.exports.json = json;
module.exports.spread = spread;
