import insertAfterNode from '../private/insertAfterNode';

// Nodes changing from one index to another will always be removed and inserted.

// TODO: Fast-path.
// TODO: Support nested arrays? Support nested updaters?
// TODO: split into two remove/insert so that we can support relocating a node?
//       maybe we simply jank the node and if it has a different parent we do not try to remove it?
//       if we do not split it, we can also support replaceChild instead of remove/insert
//       we can fast-path a lot of stuff if we do not explicitly need to remove/insert in order
//       we could also generate a remove/insert plan, but maybe that's more costly than it's worth
//       but it should amortize with the costly remove/insert so maybe it doesn't matter
//       can also use a recursion-callback
// TODO: Support string children directly?

export default function updateNodeChildrenStaticallyIndexed(containerNode, nextChildren, lastChildren) {
  if (nextChildren === lastChildren) {
    return;
  }

  if (lastChildren == null) {
    // Fast-path. Just add everything.
    for (let i = 0; i < nextChildren.length; i++) {
      let nextChild = nextChildren[i];
      if (nextChild != null) {
        containerNode.appendChild(nextChild);
      }
    }
    return;
  }

  for (let i = 0; i < lastChildren.length; i++) {
    let lastChild = lastChildren[i];
    if (lastChild != null) {
      // Skip "nextChild == null", it is implicit in "lastChild !== nextChild".
      if (lastChild !== nextChildren[i]) {
        containerNode.removeChild(lastChild);
      }
    }
  }

  let prevNode = null;

  for (let i = 0; i < nextChildren.length; i++) {
    let nextChild = nextChildren[i];
    if (nextChild != null) {
      // Skip "lastChild == null", it is implicit in "nextChild !== lastChild".
      if (nextChild !== lastChildren[i]) {
        insertAfterNode(containerNode, nextChild, prevNode);
      }

      prevNode = nextChild;
    }
  }
}
