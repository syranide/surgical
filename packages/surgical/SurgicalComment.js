export default class SurgicalComment {
  static createComponent(ownerDocument, text) {
    let that = new SurgicalComment;
    that.node = ownerDocument.createComment(text);
    that.text = text;

    return that;
  }

  static createComponentOnNode(externalNode, text) {
    throw new Error;
  }

  /*mountComponent() {
  }*/

  update(nextText) {
    if (this.text === nextText) {
      return;
    }

    this.node.data = nextText;
    this.text = nextText;
  }

  /*unmountComponent() {
  }*/

  destroy() {
  }
}
