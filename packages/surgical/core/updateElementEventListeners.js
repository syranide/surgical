import objectKeyValueReconcile from '../private/objectKeyValueReconcile';

function updateElementListener(listenerNode, name, nextValue, lastValue) {
  if (lastValue != null) {
    listenerNode.removeEventListeners(name, lastValue);
  }
  if (nextValue != null) {
    listenerNode.addEventListeners(name, nextValue);
  }
}

export default function updateElementEventListeners(listenerNode, nextListeners, lastListeners) {
  objectKeyValueReconcile(nextListeners, lastListeners, listenerNode, updateElementListener);
}
