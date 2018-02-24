import ElementProxyEventListeners from './ElementProxyEventListeners';

export default function updateElementProxyEventListeners(listenerNode, instance, nextListeners, lastListeners) {
  if (lastListeners == null) {
    if (nextListeners != null) {
      instance = new ElementProxyEventListeners(listenerNode, nextListeners);
    }
  } else if (nextListeners != null) {
    instance.update(nextListeners);
  } else {
    // instance.destroy();
    instance = null;
  }

  return instance;
}
