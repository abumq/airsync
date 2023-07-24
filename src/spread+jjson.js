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

// ATTENTION!!
// jjson and spread are still under development
// they should not be used in production
//
// Developer note: We need to ensure there isn't any race
// condition with COUNTER global variable
// for spread()

const { json } = require('./json');

let COUNTER = 0;
const KEY_NAME = '__airsync_jjson';

if (typeof global === 'undefined') {
  if (typeof window === 'undefined') {
    throw new Error('spread() only support in browser or node')
  }
  global = window;
}

/**
 * Flags the field to be spreaded in resulting JSON.
 * 
 * **NOTE: This is not production-ready just yet**
 */
const spread = () => {
  COUNTER += 1;
  return KEY_NAME + COUNTER;
}

/**
 * Create special JSON with spreaded values instead of keyed values.
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
const jjson = async (val, opts = {}) => {
  const result = await json(val, opts)
  for (const k in result) {
    if (k.indexOf(KEY_NAME) === 0) {
      Object.assign(result, result[k])
      delete result[k];
    }
  }
  return result;
}

module.exports.jjson = jjson;
module.exports.spread = spread;
