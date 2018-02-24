export default function clearNodeChildren(parentNode) {
  while (parentNode.lastChild !== null) {
    parentNode.removeChild(parentNode.lastChild);
  }
}
