const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function objectKeyValueReconcile(nextObject, lastObject, callbackArg, callback) {
  if (nextObject === lastObject) {
     return;
  }

  if (lastObject == null) {
    // Fast-path. Just add everything.
    if (nextObject != null) {
      let nextKeys = Object.keys(nextObject);
      for (let i = 0; i < nextKeys.length; i++) {
        let name = nextKeys[i];
        // Add.
        callback(callbackArg, name, nextObject[name], undefined);
      }
    }
    return;
  }

  // Fast-path. Just remove everything.
  if (nextObject == null) {
    let lastKeys = Object.keys(lastObject);
    for (let i = 0; i < lastKeys.length; i++) {
      let name = lastKeys[i];
      // Remove.
      callback(callbackArg, name, undefined, lastObject[name]);
    }
    return;
  }

  let nextKeys = Object.keys(nextObject);
  let lastKeys = Object.keys(lastObject);

  // Fast-path. If all or the starting keys are in the same order then we can
  // avoid the expensive hasOwnProperty-call. This improves perf significantly
  // those cases where it applies and is essentially free otherwise.
  // -- 23 Feb 2018
  let sameNextKeys = true;
  let i = 0;
  for (; i < lastKeys.length; i++) {
    let name = lastKeys[i];
    if (name !== nextKeys[i]) {
      sameNextKeys = false;
      break;
    }

    let nextValue = nextObject[name];
    let lastValue = lastObject[name];
    if (nextValue !== lastValue) {
      // Update.
      callback(callbackArg, name, nextValue, lastValue);
    }
  }

  // If nextKeys are not all in lastKeys then continue iterating over lastObject.
  if (!sameNextKeys) {
    for (let j = i; j < lastKeys.length; j++) {
      let name = lastKeys[j];
      let lastValue = lastObject[name];
      if (hasOwnProperty.call(nextObject, name)) {
        let nextValue = nextObject[name];
        if (nextValue !== lastValue) {
          // Update.
          callback(callbackArg, name, nextValue, lastValue);
        }
      } else {
        // Remove.
        callback(callbackArg, name, undefined, lastValue);
      }
    }
  }

  // If keys are not equal then continue iterating over nextObject.
  if (!sameNextKeys || nextKeys.length !== lastKeys.length) {
    for (let j = i; j < nextKeys.length; j++) {
      let name = nextKeys[j];
      if (!hasOwnProperty.call(lastObject, name)) {
        // Add
        callback(callbackArg, name, nextObject[name], undefined);
      }
    }
  }
}
