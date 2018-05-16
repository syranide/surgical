export default function updateElementAttributeNS(node, namespaceURI, name, nextValue, lastValue) {
  if (nextValue !== lastValue) {
    if (nextValue != null && nextValue !== false) {
      node.setAttributeNS(namespaceURI, name, (nextValue === true ? '' : nextValue));
    } else if (lastValue != null && lastValue !== false) {
      node.removeAttributeNS(namespaceURI, name);
    }
  }
}
