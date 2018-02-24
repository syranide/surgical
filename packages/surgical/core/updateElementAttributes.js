import objectKeyValueReconcile from '../private/objectKeyValueReconcile';

function updateElementAttribute(node, name, nextValue, lastValue) {
  if (nextValue != null && nextValue !== false) {
    node.setAttribute(name, (nextValue === true ? '' : nextValue));
  } else if (lastValue != null && lastValue !== false) {
    node.removeAttribute(name);
  }
}

export default function updateElementAttributes(node, nextAttributes, lastAttributes) {
  objectKeyValueReconcile(nextAttributes, lastAttributes, node, updateElementAttribute);
}
