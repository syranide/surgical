export function declare(type, data) {
  if (type == null || type.createComponent === undefined) {
    throw new Error;
  }
  return {type, key: null, data};
}

export function declareWithKey(type, key, data) {
  if (type == null || type.createComponent === undefined) {
    throw new Error;
  }
  return {type, key, data};
}

export function declareContent(type, data) {
  if (type == null || type.createContent === undefined) {
    throw new Error;
  }
  return {type, key: null, data};
}

export function declareContentWithKey(type, key, data) {
  if (type == null || type.createContent === undefined) {
    throw new Error;
  }
  return {type, key, data};
}
