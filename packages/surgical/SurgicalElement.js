import SurgicalBaseElement from './SurgicalBaseElement';
import updateElementAttribute from './core/updateElementAttribute';
import updateElementAttributeNS from './core/updateElementAttributeNS';
import updateElementAttributes from './core/updateElementAttributes';
import updateElementProxyEventListeners from './core/updateElementProxyEventListeners';
import updateStyleProperties from './core/updateStyleProperties';

// TODO: applyCallback is rather experimental
// TODO: Should probably attach this as an object instead of adding methods?
//       if it's objects then they could be composed... interesting.

export default class SurgicalElement extends SurgicalBaseElement {
  createElement(node, props) {
    // Significant perf win for caching "node.style". -- 24 Feb 2018
    this.nodeStyle = node.style;

    updateElementAttribute(node, 'class', props.className, null);
    // Safari still does not support "href" for SVG, "xlink:href" is still required. -- 16 May 2018
    updateElementAttributeNS(node, 'http://www.w3.org/1999/xlink', 'xlink:href', props.xlinkHref, null);
    updateElementAttributes(node, props.attributes, null);
    updateStyleProperties(this.nodeStyle, props.style, null);
    this.eventListenersInstance = updateElementProxyEventListeners(node, null, props.listeners, null);

    if (props.callback != null) {
      props.callback(node, props.callbackData, null/*, this*/);
    }
  }

  updateElement(node, nextProps, lastProps) {
    //if (nextProps.key !== undefined &&
    //    nextProps.key === lastProps.key) {
    //  return;
    //}

    updateElementAttribute(node, 'class', nextProps.className, lastProps.className);
    updateElementAttributeNS(node, 'http://www.w3.org/1999/xlink', 'xlink:href', nextProps.xlinkHref, lastProps.xlinkHref);
    updateElementAttributes(node, nextProps.attributes, lastProps.attributes);
    updateStyleProperties(this.nodeStyle, nextProps.style, lastProps.style);
    this.eventListenersInstance = updateElementProxyEventListeners(node, this.eventListenersInstance, nextProps.listeners, lastProps.listeners);

    // TODO: this is super-unsafe if we support destroying stuff through the callback
    //       either we require same callback/destroy-create or we should not support destroy!
    if (nextProps.callback != null) {
      nextProps.callback(node, nextProps.callbackData, lastProps.callbackData/*, this*/);
    }
  }

  destroyElement(node, lastProps) {
    if (lastProps.callback != null) {
      lastProps.callback(node, null, lastProps.callbackData/*, this*/);
    }
  }
}
