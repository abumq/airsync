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

const { json } = require('./json');

const KEY_NAME = '__airsync_jjson';

if (typeof global === 'undefined') {
  if (typeof window === 'undefined') {
    throw new Error('spread() only support in browser or node')
  }
  global = window;
}

const spread = () => {
  global[KEY_NAME] = global[KEY_NAME] || [];
  const result = KEY_NAME + global[KEY_NAME].length;
  global[KEY_NAME].push(result)
  return result;
}

const jjson = async (obj, opts = {}) => {
  const result = await json(obj, opts)
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
