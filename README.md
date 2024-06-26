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
import { convertFn, resolve } from "airsync";

// or using package
import airsync from "airsync";

// using require

const { convertFn, resolve } = require("airsync");

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
### Problem
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
### Existing Solution
Either you can write await for each one of the promises, like:
```javascript
const props = {
  age: await calcAge(),
}
```

#### Problems with this solution

 * This is going to blow out very soon, meaning, as you introduce new calls or fields in this JSON, it will become very unreadable
 * The biggest problem with this is performance. This is becoming blocking calls as we are going to await for the results from functions

### AirSync Solution

You can use AirSync to solve this issue
```javascript
const { resolve } = require("airsync");

const props = resolve({
  age: calcAge(),
})
```

## Spread Operator
### Problem
Lets say you have a code

```js
const encodeKey = async () => {
  return { keyId: 123 }
}
```

and you want to create JSON like:
```js
{
  keyId: 123
}
```

the following **WILL NOT** create desired result
```js
const result = await resolve({
  keyId: encodeKey(),
})
```

what about this?

```js
const result = await resolve({
  ...encodeKey(),
})
```
This is also not going to work because `encodeKey()` is an async function.

### Existing Solution
We have a solution
```js
const result = await resolve({
  ...await encodeKey(),
})
```

#### Problems with this solution
All of a sudden, our code has to wait for `encodeKey` to finish, and if the JSON being produced is long with a lot of `await` like this, this is going to be very slow.

### AirSync Solution
Luckily, we have `spread()`

```js
const { spread, resolve } = require('airsync');

const result = await resolve({
  [spread()]: encodeKey(),
})
```

This will result in correct JSON + this code will run asynchronously no matter how many objects are "spreaded".

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
const { convertFn } = require("airsync");
// or you can import using 
// const airsync = require('airsync') 
// and use airsync.convertFn(...)

const getAge = async () => 123;
const getDetail = convertFn(async (age) => `The age is ${age}`); // notice the wrap around "convertFn"

const result = await getDetail(getAge());
```

Try it on [RunKit](https://npm.runkit.com/airsync)

# Misc Features

## Options

If the first parameter is an object for the `convertFn()`, that object is used for setting up the options.

For example:

```javascript
const getNumb = convertFn(() => 123, {
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

Converting existing exports to crafted functions is easy, either using `convertFn` for each function which can be cumbersome depending on number of functions; or you can simply convert the whole object using a helper function `exportFns`.

Let's say you have:

```javascript
const function1 = () => {};
const function2 = () => {};

module.exports = {
  function1,
  function2,
};
```

Just use `exportFns` when exporting

```javascript
const { exportFns } = require("airsync");

const function1 = () => {};
const function2 = () => {};

module.exports = exportFns({
  function1,
  function2,
});
```

Alternatively, you can do it when importing like in example of `/examples/resolve.js`. Doing it multiple times does not harm.

## Get Object Value

If you have a function that returns an object, and you want to grab just one specific value from the object, you can use following `get` function to do that.

This function used to be part of library. Since `1.0.4`, the `get()` function is removed (see CHANGELOG). However, if you need it, you can add it as utility in your project.

```js
const { get } = require('airsync/get');
```

This function has peer dependency of [lodash.get](https://www.npmjs.com/package/lodash.get)

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
