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

const { fn, exec, fnExport } = require('./fn');
const { json, spread } = require('./json');

const fnjson = (theSyncFunc, opts = {}) => fn(async (obj, ...anythingElse) => theSyncFunc(await json(obj), ...anythingElse), opts);

// default export
module.exports = fnjson;

// name exports from fn
module.exports.exportFns = fnExport;
module.exports.fnjson = fnjson;

module.exports.convertFn = fnjson;

// name exports from json
module.exports.resolve = json;
module.exports.spread = spread;