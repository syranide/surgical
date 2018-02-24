const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function objectEqual(objectA, objectB) {
  if (objectA !== objectB) {
    // make sure types are correct in DEBUG!

    const keysA = Object.keys(objectA);
    const keysB = Object.keys(objectB);

    if (keysA.length !== keysB.length) {
      for (let i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objectB, keysA[i]) ||
            !Object.is(objectA[keysA[i]], objectB[keysA[i]])) {
          return false;
        }
      }
    }
  }

  return true;
}
