export default class SurgicalText {
  static createComponent(ownerDocument, text) {
    throw new Error('Illegal to construct SurgicalText directly');
  }

  static createComponentOnNode(externalNode, text) {
    throw new Error('Illegal to construct SurgicalText directly');
  }
}
