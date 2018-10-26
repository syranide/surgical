const hasOwnProperty = Object.prototype.hasOwnProperty;
const stylePropertiesCache = new WeakMap;

function updateStyleProperty(style, name, nextValue, lastValue) {
  if (nextValue != null) {
    style.setProperty(name, nextValue);
  } else if (lastValue != null) {
    style.removeProperty(name);
  }
}

export default function setStyleProperties(style, properties) {
  let propertiesCache = stylePropertiesCache.get(style);
  if (propertiesCache === undefined) {
    propertiesCache = new Map;
    stylePropertiesCache.set(style, propertiesCache);
  }

  let keys = Object.keys(style);
  for (let i = 0; i < keys.length; i++) {
    let name = keys[i];
    let nextValue = style[name];
    let lastValue = propertiesCache.get(name);
    if (lastValue !== nextValue) {
      propertiesCache.set(name, nextValue);
      updateStyleProperty(style, name, nextValue, lastValue);
    }
  }
}
