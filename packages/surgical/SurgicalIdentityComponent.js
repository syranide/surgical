// TODO: should actually be it's own instance for posterity reasons
export default class SurgicalIdentityComponent {
  static createComponent(ownerDocument, component) {
    return component.type.createComponent(ownerDocument, component.data);
  }

  static createComponentOnNode(externalNode, component) {
    return component.type.createComponent(externalNode, component.data);
  }
}
