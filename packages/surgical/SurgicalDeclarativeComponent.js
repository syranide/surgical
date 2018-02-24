import enhanceError from './private/enhanceError';

class SurgicalDeclarativeComponentHost {
  static createComponent(componentClass, ownerDocument, props) {
    let that = new SurgicalDeclarativeComponentHost;

    let componentInstance = new componentClass;
    componentInstance.host = that;
    componentInstance.props = props;
    componentInstance.state = null;
    // componentInstance.dirty = false;

    if (componentInstance.componentBeforeCreate !== undefined) {
      componentInstance.componentBeforeCreate();
    }

    let renderedState = componentInstance.state;
    let renderComponent = componentInstance.render();

    // componentInstance.dirty = false;

    let renderInstance;
    try {
      renderInstance = renderComponent.type.createComponent(ownerDocument, renderComponent.data);
    } catch (e) {
      throw enhanceError(e, 'createComponent', renderComponent);
    }

    if (componentInstance.componentAfterCreate !== undefined) {
      componentInstance.componentAfterCreate();
    }

    that.node = renderInstance.node;
    that.renderedProps = props;
    that.renderedState = renderedState;
    that.componentInstance = componentInstance;
    that.renderComponent = renderComponent;
    that.renderInstance = renderInstance;
    return that;
  }

  static createComponentOnNode(componentClass, externalNode, props) {
    let that = new SurgicalDeclarativeComponentHost;

    let componentInstance = new componentClass;
    componentInstance.host = that;
    componentInstance.props = props;
    componentInstance.state = null;
    // componentInstance.dirty = false;

    if (componentInstance.componentBeforeCreate !== undefined) {
      componentInstance.componentBeforeCreate();
    }

    let renderedState = componentInstance.state;
    let renderComponent = componentInstance.render();

    // componentInstance.dirty = false;

    let renderInstance;
    try {
      renderInstance = renderComponent.type.createComponentOnNode(externalNode, renderComponent.data);
    } catch (e) {
      console.error(componentInstance.constructor.name);
      throw e;
    }

    if (componentInstance.componentAfterCreate !== undefined) {
      componentInstance.componentAfterCreate();
    }

    that.node = externalNode;
    that.renderedProps = props;
    that.renderedState = renderedState;
    that.componentInstance = componentInstance;
    that.renderComponent = renderComponent;
    that.renderInstance = renderInstance;
    return that;
  }

  /*mountComponent() {
    if (this.componentInstance.componentBeforeMount) {
      this.componentInstance.componentBeforeMount();
    }

    this.renderInstance.mountComponent();

    if (this.componentInstance.componentAfterMount) {
      this.componentInstance.componentAfterMount();
    }
  }*/

  update(nextProps) {
    let componentInstance = this.componentInstance;

    if (componentInstance.componentReceiveProps !== undefined) {
      componentInstance.componentReceiveProps(nextProps);
    }

    componentInstance.props = nextProps;
    this.requestRender();
  }

  requestRender() {
    let componentInstance = this.componentInstance;

    let lastProps = this.renderedProps;
    let lastState = this.renderedState;

    if (componentInstance.componentUpdate !== undefined) {
      componentInstance.componentUpdate(lastProps, lastState);

      this.renderedProps = componentInstance.props;
      this.renderedState = componentInstance.state;
    } else if (
        componentInstance.props !== lastProps ||
        componentInstance.state !== lastState) {
      this.forceRender();
    }
  }

  forceRender() {
    let componentInstance = this.componentInstance;
    let nextRenderComponent = componentInstance.render();

    let lastRenderComponent = this.renderComponent;
    if (nextRenderComponent.type !== lastRenderComponent.type ||
        nextRenderComponent.key !== lastRenderComponent.key) {
      throw new Error;
    }

    try {
      this.renderInstance.update(nextRenderComponent.data);
    } catch (e) {
      console.error(componentInstance.constructor.name);
      throw e;
    }

    this.renderedProps = componentInstance.props;
    this.renderedState = componentInstance.state;
    this.renderComponent = nextRenderComponent;
  }

  /*unmountComponent() {
    if (this.componentInstance.componentBeforeUnmount) {
      this.componentInstance.componentBeforeUnmount();
    }

    this.renderInstance.unmountComponent();

    if (this.componentInstance.componentAfterUnmount) {
      this.componentInstance.componentAfterUnmount();
    }
  }*/

  destroy() {
    let componentInstance = this.componentInstance;
    if (componentInstance.componentBeforeDestroy !== undefined) {
      componentInstance.componentBeforeDestroy();
    }

    try {
      this.renderInstance.destroy();
    } catch (e) {
      console.error(componentInstance.constructor.name);
      throw e;
    }
  }
}

export default class SurgicalDeclarativeComponent {
  static createComponent(ownerDocument, data) {
    return SurgicalDeclarativeComponentHost.createComponent(this, ownerDocument, data);
  }

  static createComponentOnNode(externalNode, data) {
    return SurgicalDeclarativeComponentHost.createComponentOnNode(this, externalNode, data);
  }

  /*static importComponent(instance, node) {
    return SurgicalDeclarativeComponentHost.importComponent(this, instance, node);
  }*/

  forceRender() {
    this.host.forceRender();
  }

  renderStateChange() {
    // TODO: Maybe just always call _update() and let shouldComponentUpdate resolve it?
    if (this.state !== this.host.renderedState) {
      this.host.requestRender();
    }
  }

  /*renderWithState(nextState, externalSideEffectsCallback) {
    this.state = nextState;
    if (externalSideEffectsCallback != null) {
      externalSideEffectsCallback();
    }
    if (this.state !== this.host.renderedState) {
      this.host._update(false);
    }
  }*/
}
