export default function insertAfterNode(parentNode, newNode, referenceNode) {
  if (referenceNode !== null) {
    parentNode.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    parentNode.insertBefore(newNode, parentNode.firstChild);
  }
}
