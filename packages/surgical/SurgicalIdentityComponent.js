// TODO: should actually be it's own instance for posterity reasons
export default class SurgicalIdentityComponent {
  /** @nocollapse */
  static createComponent(ownerDocument, component) {
    return component.type.createComponent(ownerDocument, component.data);
  }

  /** @nocollapse */
  static createComponentOnNode(externalNode, component) {
    return component.type.createComponent(externalNode, component.data);
  }
}
