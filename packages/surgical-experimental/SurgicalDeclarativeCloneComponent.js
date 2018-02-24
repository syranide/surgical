class SurgicalDeclarativeCloneComponentHost {
  static createComponent(componentClass, ownerDocument, data) {
    let that = new SurgicalDeclarativeCloneComponentHost;

    let componentInstance = new componentClass(data);
    componentInstance.host = that;

    let importInstance = componentClass.baseCloneInstance;
    let importNode = importInstance.node.cloneNode(true);
    let renderInstance = componentClass.baseCloneVElement.type.importComponent(importInstance, importNode);

    let renderVElement = componentInstance.render(data);
    renderInstance.update(renderVElement.data);

    // if (this.componentInstance.componentWillMount != null) {
    //   this.componentInstance.componentWillMount();
    // }

    if (componentInstance.componentAfterCreate != null) {
      componentInstance.componentAfterCreate();
    }

    that.node = renderInstance.node;
    that.data = data;
    that.componentInstance = componentInstance;
    that.renderVElement = renderVElement;
    that.renderInstance = renderInstance;

    return that;
  }

  /*static importComponent(componentClass, externalInstance, externalNode) {
    let that = new SurgicalDeclarativeComponentHost;
    let data = externalInstance.data;

    let componentInstance = new componentClass(data);
    componentInstance.host = that;

    let renderVElement = externalInstance.renderVElement;
    let renderInstance = renderVElement.type.importComponent(externalInstance.renderInstance, externalNode);

    // if (this.componentInstance.componentWillMount != null) {
    //   this.componentInstance.componentWillMount();
    // }

    if (componentInstance.componentAfterCreate != null) {
      componentInstance.componentAfterCreate();
    }

    that.node = renderInstance.node;
    that.data = data;
    that.componentInstance = componentInstance;
    that.renderVElement = renderVElement;
    that.renderInstance = renderInstance;

    return that;
  }*/

  update(nextData) {
    let lastData = this.data;
    if (lastData.type !== nextData.type) {
      throw new Error;
    }

    let lastRenderVElement = this.renderVElement;
    let nextRenderVElement = this.componentInstance.render(nextData);

    if (lastRenderVElement.type !== nextRenderVElement.type ||
        lastRenderVElement.key !== nextRenderVElement.key) {
      throw new Error;
    }

    // if (this.componentInstance.componentWillReceiveProps != null) {
    //   this.componentInstance.componentWillReceiveProps(nextRenderVElement.data);
    // }

    if (this.componentInstance.componentBeforeUpdate != null) {
      this.componentInstance.componentBeforeUpdate(nextRenderVElement.data);
    }

    this.renderInstance.update(nextRenderVElement.data);

    if (this.componentInstance.componentAfterUpdate != null) {
      this.componentInstance.componentAfterUpdate(lastRenderVElement.data);
    }
    this.renderVElement = nextRenderVElement;
    this.data = nextData;
  }

  destroy() {
    if (this.componentInstance.componentBeforeDestroy != null) {
      this.componentInstance.componentBeforeDestroy();
    }

    if (this.componentInstance.destroy != null) {
      this.componentInstance.destroy();
    }

    this.renderInstance.destroy();
  }
}

export default class SurgicalDeclarativeCloneComponent {
  static createComponent(ownerDocument, data) {
    return SurgicalDeclarativeCloneComponentHost.createComponent(this, ownerDocument, data);
  }

  /*static importComponent(instance, node) {
    return SurgicalDeclarativeCloneComponentHost.importComponent(this, instance, node);
  }*/

  static prepareBaseClone() {
    let vElement = this.renderBaseClone();
    let instance = vElement.type.createComponent(document, vElement.data);

    this.baseCloneVElement = vElement;
    this.baseCloneInstance = instance;
  }

  setState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.forceUpdate();
  }

  forceUpdate() {
    // TODO: superhack!
    this.host.update(this.host.data);
  }
}
