import insertAfterNode from '../private/insertAfterNode';

// When encountering two children switching sides, this will cause a move operation
// on the child being moved down. So moving an item down only moves that element.
// Moving an element up will move all elements between its last and next index.

// TODO: Fast-path. If start-part of arrays are the same, do simple non-map loop.
//       Can we extend this for sub-ranges too? If an element moves, continue simple non-map loop after? with staggered indicies
//       Is there a perf win?
//       Might be possible to arrange it differently too, so that insert/removes are done at the same time.
//       Caching nextIndexByNode seems beneficial, maybe we can offset cost by merging into loop? Or simply cache it...
//       Or maybe weakmap could be a reasonable alternative for all apis?
// TODO: remove dependency on insertAfterNode?
export default function updateNodeChildrenMoveDown(containerNode, nextChildren, lastChildren) {
  if (nextChildren === lastChildren) {
    return;
  }

  if (lastChildren == null) {
    // Fast-path. Just add everything.
    for (let i = 0; i < nextChildren.length; i++) {
      containerNode.appendChild(nextChildren[i]);
    }
    return;
  }

  let nextNodeIndex = new Map;
  let lastNodeIndex = new Map;

  for (let i = 0; i < lastChildren.length; i++) {
    let lastChild = lastChildren[i];
    if (lastChild == null) {
      throw new Error('Child must not be null');
    }
    lastNodeIndex.set(lastChild, i);
  }

  for (let i = 0; i < nextChildren.length; i++) {
    let nextChild = nextChildren[i];
    if (nextChild == null) {
      throw new Error('Child must not be null');
    }
    nextNodeIndex.set(nextChild, i);
  }

  for (let i = 0; i < lastChildren.length; i++) {
    let lastChild = lastChildren[i];
    if (!nextNodeIndex.has(lastChild)) {
      containerNode.removeChild(lastChild);
    }
  }

  let prevNode = null;
  let maxj = 0;

  for (let i = 0; i < nextChildren.length; i++) {
    let nextChild = nextChildren[i];
    let j = lastNodeIndex.get(nextChild);
    if (j === undefined || maxj > j) {
      insertAfterNode(containerNode, nextChild, prevNode);
    } else {
      maxj = j;
    }

    prevNode = nextChild;
  }
}
