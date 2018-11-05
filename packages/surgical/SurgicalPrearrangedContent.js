import SurgicalText from './SurgicalText';

import updateNodeChildrenStaticallyIndexed from './core/updateNodeChildrenStaticallyIndexed';

// TODO: maybe not update prevNode when we're not inserting stuff
//       for non-null-keys content it is easy to just read the following element instead
//       this should be faster than reading current + nextSibling?
// TODO: maybe just storing last non-null instance is measurably faster?

export default class SurgicalPrearrangedContent {
  /** @nocollapse */
  static createContent(containerNode, components) {
    let that = new SurgicalPrearrangedContent;
    let instances = new Array(components.length);
    let ownerDocument = containerNode.ownerDocument;
    let nodes = new Array(components.length);

    for (let i = 0; i < components.length; i++) {
      let component = components[i];
      if (component != null) {
        if (component.type === SurgicalText) {
          let node = ownerDocument.createTextNode(component.data);
          instances[i] = node;
          nodes[i] = node;
        } else {
          // TODO: try-finally
          let instance = component.type.createComponent(ownerDocument, component.data);
          instances[i] = instance;
          nodes[i] = instance.node;
        }
      } else {
        // Make sure the array does not become sparse
        instances[i] = null;
        nodes[i] = null;
      }
    }

    updateNodeChildrenStaticallyIndexed(containerNode, nodes, null);

    that.nodes = nodes;
    that.containerNode = containerNode;
    that.components = components;
    that.instances = instances;

    return that;
  }

  /*mountContent() {
    let instances = this.instances;

    for (let i = 0; i < instances.length; i++) {
      let instance = instances[i];
      if (instance !== null) {
        instance.mountComponent();
      }
    }
  }*/

  update(nextComponents) {
    let lastComponents = this.components;
    // Reuse the instances array.  Only increase the size, never decrease.
    // Size should very rarely fluctuate. It seems setting the length only
    // affects performance negatively.
    let instances = this.instances;
    let containerNode = this.containerNode;
    let ownerDocument = containerNode.ownerDocument;
    let nextNodes = new Array(nextComponents.length);
    let lastNodes = this.nodes;

    for (let i = 0; i < lastComponents.length; i++) {
      let lastComponent = lastComponents[i];

      if (lastComponent != null) {
        let nextComponent = nextComponents[i];
        if (lastComponent.type !== SurgicalText) {
          if (nextComponent == null ||
              lastComponent.type !== nextComponent.type ||
              lastComponent.key !== nextComponent.key) {
            let lastInstance = instances[i];
            // TODO: try-finally
            lastInstance.destroy();
          }
        }
      }
    }

    for (let i = 0; i < nextComponents.length; i++) {
      let nextComponent = nextComponents[i];

      if (nextComponent != null) {
        let lastComponent = lastComponents[i];
        if (nextComponent.type === SurgicalText) {
          let node;
          if (lastComponent == null ||
              lastComponent.type !== SurgicalText) {
            node = ownerDocument.createTextNode(nextComponent.data);
            instances[i] = node;
          } else if (lastComponent.data !== nextComponent.data) {
            node = instances[i];
            node.data = nextComponent.data;
          } else {
            node = instances[i];
          }

          nextNodes[i] = node;
        } else {
          let nextInstance;

          if (lastComponent == null ||
              nextComponent.type !== lastComponent.type ||
              nextComponent.key !== lastComponent.key) {
            // TODO: try-finally
            nextInstance = nextComponent.type.createComponent(ownerDocument, nextComponent.data);
            instances[i] = nextInstance;
          } else {
            nextInstance = instances[i];
            // TODO: try-finally
            nextInstance.update(nextComponent.data);
          }

          nextNodes[i] = nextInstance.node;
        }
      } else {
        // Make sure the array does not become sparse
        instances[i] = null;
        nextNodes[i] = null;
      }
    }

    updateNodeChildrenStaticallyIndexed(containerNode, nextNodes, lastNodes);

    this.nodes = nextNodes;
    this.components = nextComponents;
    this.instances = instances;
  }

  /*unmountContent() {
    let instances = this.instances;

    for (let i = 0; i < instances.length; i++) {
      let instance = instances[i];
      if (instance !== null) {
        instance.unmountComponent();
      }
    }
  }*/

  destroy() {
    let components = this.components;
    let instances = this.instances;

    for (let i = 0; i < components.length; i++) {
      let component = components[i];
      if (component != null &&
          component.type !== SurgicalText) {
        // TODO: try-finally
        instances[i].destroy();
      }
    }
  }
}
