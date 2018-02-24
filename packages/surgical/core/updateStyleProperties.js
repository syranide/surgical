import objectKeyValueReconcile from '../private/objectKeyValueReconcile';

function updateStyleProperty(style, name, nextValue, lastValue) {
  if (nextValue != null) {
    style.setProperty(name, nextValue);
  } else if (lastValue != null) {
    style.removeProperty(name);
  }
}

export default function updateStyleProperties(style, nextProperties, lastProperties) {
  objectKeyValueReconcile(nextProperties, lastProperties, style, updateStyleProperty);
}
