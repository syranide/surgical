import enhanceError from './private/enhanceError';
import updateNodeChildrenMoveDown from './core/updateNodeChildrenMoveDown';


// TODO: maybe not update prevNode when we're not inserting stuff
//       for non-null-keys content it is easy to just read the following element instead
//       this should be faster than reading current + nextSibling?
// TODO: Maybe this implementation is broken, it seems fishy
// TODO: it should be trivial to ignore nulls... worth it? why?

export default class SurgicalReorderableMoveDownContent {
  static createContent(containerNode, components) {
    let instances = new Array(components.length);
    let indexByKey = new Map;
    let ownerDocument = containerNode.ownerDocument;
    let nodes = new Array(components.length);

    for (let i = 0; i < components.length; i++) {
      let component = components[i];
      if (component == null ||
          component.key === undefined) {
        throw new Error('Child or key must not be undefined');
      }

      let instance;
      try {
        instance = component.type.createComponent(ownerDocument, component.data);
      } catch (e) {
        throw enhanceError(e, 'createComponent', component);
      }
      instances[i] = instance;
      nodes[i] = instance.node;
      indexByKey.set(component.key, i);
    }

    updateNodeChildrenMoveDown(containerNode, nodes, null);

    let that = new SurgicalReorderableMoveDownContent;
    that.nodes = nodes;
    that.containerNode = containerNode;
    that.components = components;
    that.instances = instances;
    that.indexByKey = indexByKey;

    return that;
  }

  /*mountContent() {
    let instances = this.instances;

    for (let i = 0; i < instances.length; i++) {
      instances[i].mountComponent();
    }
  }*/

  update(nextComponents) {
    let lastComponents = this.components;
    let nextInstances = new Array(nextComponents.length);
    let lastInstances = this.instances;
    let nextIndexByKey = new Map;
    let lastIndexByKey = this.indexByKey;
    let containerNode = this.containerNode;
    let ownerDocument = containerNode.ownerDocument;
    let lastNodes = this.nodes;
    let nextNodes = new Array(nextComponents.length);

    for (let i = 0; i < nextComponents.length; i++) {
      let nextComponent = nextComponents[i];
      if (nextComponent == null ||
          nextComponent.key === undefined) {
        throw new Error('Child or key must not be undefined');
      }

      nextIndexByKey.set(nextComponent.key, i);
    }

    for (let i = 0; i < lastComponents.length; i++) {
      let lastComponent = lastComponents[i];
      let j = nextIndexByKey.get(lastComponent.key);
      if (j === undefined ||
          lastComponent.type !== nextComponents[j].type) {
        try {
          lastInstances[i].destroy();
        } catch (e) {
          throw enhanceError(e, 'destroy', lastComponent);
        }
      }
    }

    for (let i = 0; i < nextComponents.length; i++) {
      let nextComponent = nextComponents[i];
      let nextInstance = null;

      let j = lastIndexByKey.get(nextComponent.key);
      if (j === undefined ||
          nextComponent.type !== lastComponents[j].type) {
        try {
          nextInstance = nextComponent.type.createComponent(ownerDocument, nextComponent.data);
        } catch (e) {
          throw enhanceError(e, 'createComponent', nextComponent);
        }
      } else {
        nextInstance = lastInstances[j];
        try {
          nextInstance.update(nextComponent.data);
        } catch (e) {
          throw enhanceError(e, 'update', nextComponent);
        }
      }

      nextInstances[i] = nextInstance;
      nextNodes[i] = nextInstance.node;
    }

    updateNodeChildrenMoveDown(containerNode, nextNodes, lastNodes);

    this.nodes = nextNodes;
    this.components = nextComponents;
    this.instances = nextInstances;
    this.indexByKey = nextIndexByKey;
  }

  /*unmountContent() {
    let instances = this.instances;

    for (let i = 0; i < instances.length; i++) {
      instances[i].unmountComponent();
    }
  }*/

  destroy() {
    let instances = this.instances;

    for (let i = 0; i < instances.length; i++) {
      try {
        instances[i].destroy();
      } catch (e) {
        throw enhanceError(e, 'destroy', this.components[i]);
      }
    }
  }

  getInstanceByKey(key) {
    let i = this.indexByKey.get(key);
    if (i === undefined) {
      return null;
    }

    return this.instances[i];
  }
}
