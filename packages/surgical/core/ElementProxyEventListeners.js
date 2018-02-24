import objectKeyValueReconcile from '../private/objectKeyValueReconcile';

function updateElementProxyEventListener(that, name, nextValue, lastValue) {
  if (lastValue == null) {
    if (nextValue != null) {
      // TODO: faster to bind this-instead? We could then reuse the same function instead
      let proxy = function(event) {
        // TODO: read up on "this" in https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        // TODO: apply arguments, or is it safe to always just have one argument?
        that.listeners[name].call(this, event);
      };

      that.instances.set(name, proxy);
      that.listenerNode.addEventListener(name, proxy);
    }
  } else if (nextValue == null) {
    let instances = that.instances;
    let proxy = instances.get(name);
    instances.delete(name);
    that.listenerNode.removeEventListener(name, proxy);
  }
}

export default class ElementProxyEventListeners {
  constructor(listenerNode, listeners) {
    let instances = new Map;
    let keys = Object.keys(listeners);

    this.instances = instances;
    this.listenerNode = listenerNode;

    objectKeyValueReconcile(listeners, null, this, updateElementProxyEventListener);

    this.listeners = listeners;
  }

  update(nextListeners) {
    // if (nextListeners === lastListeners) {
    //   return;
    // }

    let lastListeners = this.listeners;

    objectKeyValueReconcile(nextListeners, lastListeners, this, updateElementProxyEventListener);

    this.listeners = nextListeners;
  }

  /*destroy() {
  }*/

  destroyListeners() {
    let lastListeners = this.listeners;

    objectKeyValueReconcile(null, lastListeners, this, updateElementProxyEventListener);
  }
}
