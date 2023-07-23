<p align="center">
    <a href="https://github.com/abumq/airsync">
      <img width="190px" src="https://github.com/abumq/airsync/raw/main/assets/logo.png?v2" />
    </a>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/airsync">
    <img alt="" src="https://img.shields.io/npm/v/airsync.svg?style=ffor-the-badge&labelColor=000000&">
  </a>
  <a aria-label="Tests" href="https://github.com/abumq/airsync/actions/workflows/run-tests.yml">
    <img alt="" src="https://github.com/abumq/airsync/actions/workflows/run-tests.yml/badge.svg">
  </a>
  <a aria-label="License" href="https://github.com/abumq/airsync/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/airsync?style=ffor-the-badge&labelColor=000000">
  </a>
</p>

# Getting Started

### Installation

```bash
npm i airsync -S
# or
yarn add airsync
```

### Import

You can use any of these methods to use airsync in your application

```javascript
// using modules
import { fn, json } from "airsync";

// or using package
import airsync from "airsync";

// using require

const { fn, json } = require("airsync");

const airsync = require("airsync");
```

# Introduction
AirSync is a powerful javascript library that you can use when using `async`.

The easiest way to see the power of this library is to checkout [`performance.js`](https://github.com/abumq/airsync/blob/main/examples/performance.js) file.

AirSync helps you:

 * Create JSON from promises without extracting functions or multiple await
 * Convert your existing functions that take promises as parameters, you do not need to wait for promises to fulfil in order to pass them to the function. You can just pass them in as is.

The best part is that AirSync makes your code readable while using full power of [non-blocking event based I/O](https://developers.redhat.com/blog/2016/08/16/why-should-i-use-node-js-the-non-blocking-event-io-framework/) that Node.js is known for.

# 1. JSON
## Problem
```javascript
const calcAge = async () => 65; // note the async

// this will not result in correct `age`
const props = {
  age: calcAge(),
}

// output:
// {age: Promise}
// Promise {<fulfilled>: undefined}
```
## Existing Solution
Either you can write await for each one of the promises, like:
```javascript
const props = {
  age: await calcAge(),
}
```

### Problems with this solution

 * This is going to blow out very soon, meaning, as you introduce new calls or fields in this JSON, it will become very unreadable
 * The biggest problem with this is performance. This is becoming blocking calls as we are going to await for the results from functions

that will blow out very soon as you scale up.

## AirSync Solution

You can use AirSync to solve this issue
```javascript
const { json } = require("airsync");

const props = json({
  age: calcAge(),
})
```

Try it on [RunKit](https://npm.runkit.com/airsync)

## Max depth

Default object depth supported by airsync is `64`.

# 2. Async Function
## Problem
```javascript
const getAge = async () => 123;
const getDetail = async (age) => `The age is ${age}`;
```

```javascript
await getDetail(getAge());

// output:
// The age is [object Promise]
// Promise {<fulfilled>: undefined}
```

## Existing Solution
Either you can wait for the `getAge()` to be resolved first and then pass it to `getDetail()` like this:
```javascript
await getDetail(await getAge());
```

or you can extract out it to variable.

### Problems with this solution

 * This is going to blow out very soon, meaning, as you introduce new calls, it will become very unreadable
 * The biggest problem with this is performance. This is becoming blocking calls as we are going to await for the results from functions

## AirSync Solution

```javascript
const { fn } = require("airsync"); // or you can import using const airsync = require('airsync') and use airsync.fn(...)

const getAge = async () => 123;
const getDetail = fn(async (age) => `The age is ${age}`); // notice the wrap around "fn"

const result = await getDetail(getAge());
```

Try it on [RunKit](https://npm.runkit.com/airsync)

## Function with JSON
`fn()` is good when the function takes normal parameters, e.g, `myfn(param1, param2)` but this will not work if we have json based parameters, e.g, `myfn({ param1: 1, param2: Promise.resolve(2) })`

For this `fnjson()` was added.

Simply pass in function in to this function.

```javascript
const getName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

const getNameSync = fnjson(getName);
```

Now if you pass in JSON with unresolved promises to the function, it would be correctly passed in to `getName` function

# Misc Features

## Options

If the first parameter is an object for the `fn()`, that object is used for setting up the options.

For example:

```javascript
const getNumb = fn(() => 123, {
  startTime: res.startTime,
  endTime: res.endTime,
});
```

You can also override the options for a crafted function later.

```javascript
getNumb.setOptions({
  // hint: server-timing
  startTime: res.startTime,
  endTime: res.endTime,

  name: "getNumb",
  description: "Get number",

  debug: false, // to enable airsync debugging
});
```

Following are the possible options

| **Option**    | **Description**                                                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | An identity for the function. Defaults to `<function>.name` - **IT MUST NOT CONTAIN SPACE**                                                                                 |
| `description` | A description for the function                                                                                                                                              |
| `startTime`   | Function for [server timing](https://www.w3.org/TR/server-timing/) - `(name, description) => {}` - the `name` and `description` is passed back to this function             |
| `endTime`     | Function for [server timing](https://www.w3.org/TR/server-timing/) - `(name) => {}` - the `name` is passed back to this function                                            |
| `debug`       | Boolean value to tell airsync whether debug logging is enabled or not. It will use a global `logger.debug()` object. If no such object exists, it will use `console.debug()` |

## Bulk Export (Advanced)

Converting existing exports to crafted functions is easy, either using `fn` for each function which can be cumbersome depending on number of functions; or you can simply convert the whole object using a helper function `fnExport`.

Let's say you have:

```javascript
const function1 = () => {};
const function2 = () => {};

module.exports = {
  function1,
  function2,
};
```

Just use `fnExport` when exporting

```javascript
const { fnExport } = require("airsync");

const function1 = () => {};
const function2 = () => {};

module.exports = fnExport({
  function1,
  function2,
});
```

Alternatively, you can do it when importing like in example of `/examples/json.js`. Doing it multiple times does not harm.

## Get Object Value

If you have a function that returns an object, and you want to grab just one specific value from the object, you can use following `get` function to do that.

This function used to be part of library. Since `1.0.4`, the `get()` function is removed (see CHANGELOG). However, if you need it, you can add it as utility in your project.

```js
const lodashGet = require('lodash.get');

// get value from the object using lodash.get
// when object is resolved
const get = (objOrPromise, path, defaultVal, options = {}) => fn(o => lodashGet(o, path) || defaultVal, options)(objOrPromise)
```

You need to add dependency to [lodash.get](https://www.npmjs.com/package/lodash.get) if you need it

```javascript

const getProfile = async (uid) => ({
  name: "John",
  age: 45,
  father: {
    name: "Peter",
  },
});

(async () => {
  console.log(await get(getProfile(), "father.name")); // output: Peter
  console.log(await get(getProfile(), "mother.name", "Steph")); // output: Steph
  console.log(await get(getProfile(), "brother.name")); // output: undefined
})();
```

# License

```
Copyright (c) 2020-present @abumq (Majid Q.)

https://github.com/abumq/airsync

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
