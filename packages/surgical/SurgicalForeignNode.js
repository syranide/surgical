// TODO: callback-style makes some sense because of being able to pass ownerDocument
//       also because it only gets the node pointer if it's actually being rendered
//       maybe there should be an extended version of this with create/update/destroy functionality
//       maybe this is good enough and more advanced use-cases can use custom components

export default class SurgicalForeignNode {
  /** @nocollapse */
  static createComponent(ownerDocument, node) {
    let that = new SurgicalForeignNode;

    if (node == null) {
      throw new Error('Node is null');
    }
    // TODO: Error only if "node.parentNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE" ?
    if (node.parentNode !== null) {
      throw new Error('Node is already mounted');
    }
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      throw new Error('Node must not be a document fragment');
    }
    if (node.ownerDocument !== ownerDocument) {
      throw new Error('Node is owned by a different document');
    }

    that.node = node;

    return that;
  }

  /** @nocollapse */
  static createComponentOnNode(externalNode, node) {
    throw new Error('Cannot create foreign node on node');
  }

  /*mountComponent() {
  }*/

  update(nextNode) {
    let lastNode = this.node;
    if (nextNode !== lastNode) {
      throw new Error('Node must not change, use key/identity');
    }
  }

  /*unmountComponent() {
  }*/

  destroy() {
  }
}
