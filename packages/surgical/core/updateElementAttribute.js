export default function updateElementAttribute(node, name, nextValue, lastValue) {
  if (nextValue !== lastValue) {
    if (nextValue != null && nextValue !== false) {
      node.setAttribute(name, (nextValue === true ? '' : nextValue));
    } else if (lastValue != null && lastValue !== false) {
      node.removeAttribute(name);
    }
  }
}
