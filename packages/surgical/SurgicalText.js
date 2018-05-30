export default class SurgicalText {
  /** @nocollapse */
  static createComponent(ownerDocument, text) {
    throw new Error('Illegal to construct SurgicalText directly');
  }

  /** @nocollapse */
  static createComponentOnNode(externalNode, text) {
    throw new Error('Illegal to construct SurgicalText directly');
  }
}
