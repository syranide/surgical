const hasOwnProperty = Object.prototype.hasOwnProperty;
const EmptyObject = Object.create(null);

// This doesn't save more than 20% or so unless you're extremely event-heavy.
// So this is worth looking into, it's just not priority right now.
// TODO: Should just need to implement handleEvent for this to work.

export default class SurgicalElementBubblingProxyEventListeners {
  constructor(listenerNode) {
    this.listenerNode = listenerNode;
    this.listenersByNode = new Map;
    this.instancesByType = new Map;
  }

  setListenerNode(listenerNode) {
    this.listenerNode = listenerNode;
  }

  handleEvent(that, type, event) {
    console.log(that, type, event);

    let currentTarget = this.listenerNode;

    // TODO: do we need type or is event.type dependable?
  }

  updateForNode(targetNode, nextListeners) {
    let listenerNode = this.listenerNode;
    let instancesByType = this.instancesByType;
    let lastListeners = this.listenersByNode.get(targetNode);

    if (nextListeners == null) {
      nextListeners = EmptyObject;
    }
    if (lastListeners == null) {
      lastListeners = EmptyObject;
    }

    for (let name in lastListeners) {
      let lastValue = lastListeners[name];
      if (lastValue != null) {
        if (!hasOwnProperty.call(nextListeners, name) ||
            nextListeners[name] == null) {
          let instance = instancesByType.get(name);
          if (instance.counter === 1) {
            instancesByType.delete(name);
            listenerNode.removeEventListener(name, instance.proxy);
          } else {
            instance.counter--;
          }
        }
      }
    }

    for (let name in nextListeners) {
      let nextValue = nextListeners[name];
      if (nextValue != null) {
        if (!hasOwnProperty.call(lastListeners, name) ||
            lastListeners[name] == null) {
          let instance = instancesByType.get(name);
          if (instance === undefined) {
            let that = this;
            // TODO: faster to bind this-instead? We could then reuse the same function instead
            let proxy = function(event) {
              that.handleEvent(this, name, event);
            };
            listenerNode.addEventListener(name, proxy);
            instance = {
              counter: 1,
              proxy: proxy,
            };
            instancesByType.set(name, instance);
          } else {
            instance.counter++;
          }
        }
      }
    }

    if (nextListeners !== EmptyObject) {
      this.listenersByNode.set(nextListeners);
    } else if (lastListeners !== EmptyObject) {
      this.listenersByNode.delete(targetNode);
    }
  }

  /*destroyForNode(targetNode, listeners) {
  }*/
}
