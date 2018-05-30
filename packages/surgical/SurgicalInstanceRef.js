// TODO: Should probably have a special createInstanceRef object to work on instead
//       ref = SurgicalInstanceRef.createRef();
//       ref.instance.node ... safer
// TODO: Maybe have a SurgicalNodeRef too?
// TODO: Maybe this should be on declaration instead? is there something to lose here?
//       It's not very nice with these pass-through components, but it's not really wrong either

function _createComponent(instance, data) {
  let that = new SurgicalInstanceRef;

  let ref = data.ref;
  if (ref.value !== null) {
    throw new Error('(DEBUG) Ref value already set');
  }

  ref.value = instance;

  that.node = instance.node;
  that.instance = instance;
  that.data = data;

  return that;
}

export default class SurgicalInstanceRef {
  /** @nocollapse */
  static createComponent(ownerDocument, data) {
    let child = data.child;
    let instance = child.type.createComponent(ownerDocument, child.data);
    return _createComponent(instance, data);
  }

  /** @nocollapse */
  static createComponentOnNode(externalNode, data) {
    let child = data.child;
    let instance = child.type.createComponentOnNode(externalNode, child.data);
    return _createComponent(instance, data);
  }

  /*mountComponent() {
  }*/

  update(nextData) {
    let lastData = this.data;
    let nextChild = nextData.child;
    if (nextChild.type !== lastData.child.type) {
      throw new Error('Child type must not change, use key/identity');
    }

    let nextRef = nextData.ref;
    let lastRef = lastData.ref;
    if (nextRef !== lastRef) {
      if (lastRef.value === null) {
        throw new Error('(DEBUG) Ref value not set');
      }
      if (nextRef.value !== null) {
        throw new Error('(DEBUG) Ref value already set');
      }

      lastRef.value = null;
      nextRef.value = this.instance;
    }

    this.instance.update(nextChild.data);
    this.data = nextData;
  }

  /*unmountComponent() {
  }*/

  destroy() {
    let lastRef = this.data.ref;
    if (lastRef.value === null) {
      throw new Error('(DEBUG) Ref value not set');
    }

    lastRef.value = null;

    this.instance.destroy();
  }
}
