import SurgicalPrearrangedContent from './SurgicalPrearrangedContent';
import clearNodeChildren from './private/clearNodeChildren';

// TODO: should probably revise override-names
// TODO: also remember that one can always reimplement this entire class, full customizability is not necessary
// TODO: should container also be moved to owner-class? maybe not... or maybe... would be useful actually...
// TODO: the benefit then could be that we can just override the base methods then instead... if that's preferable ... maybe
// TODO: if textnodes are inlined then maybe this component needs to know it too

function _getTagName(classTagName, propsTagName) {
  if (classTagName != null) {
    if (propsTagName !== undefined) {
      throw new Error;
    }
    return classTagName;
  }

  if (propsTagName == null) {
    throw new Error;
  }
  return propsTagName;
}

function _createComponent(elementClass, node, props) {
  let that = new elementClass;
  that.createElement(node, props);

  let children = props.children;
  let content = props.content;
  let contentInstance;
  if (children != null) {
    if (content != null) {
      throw new Error;
    }
    contentInstance = SurgicalPrearrangedContent.createContent(node, children);
  } else if (content != null) {
    contentInstance = content.type.createContent(node, content.data);
  } else {
    contentInstance = null;
  }

  that.node = node;
  that.props = props;
  that.contentInstance = contentInstance;
  return that;
}

export default class SurgicalBaseElement {
  static createComponent(ownerDocument, props) {
    let tagName = _getTagName(this.tagName, props.tagName);

    let node;
    let namespaceURI = this.namespaceURI;
    if (namespaceURI != null) {
      node = ownerDocument.createElementNS(namespaceURI, tagName);
    } else {
      node = ownerDocument.createElement(tagName);
    }

    return _createComponent(this, node, props);
  }

  static createComponentOnNode(externalNode, props) {
    let tagName = _getTagName(this.tagName, props.tagName);

    // TODO: This is not exact, but probably as good as it gets.
    //       https://johnresig.com/blog/nodename-case-sensitivity/
    if (tagName.toUpperCase() !== externalNode.tagName.toUpperCase()) {
      throw new Error;
    }

    let namespaceURI = this.namespaceURI;
    if (namespaceURI == null) {
      // TODO: This is not correct, but good enough for now.
      namespaceURI = 'http://www.w3.org/1999/xhtml';
    }
    if (namespaceURI !== externalNode.namespaceURI) {
      throw new Error;
    }

    return _createComponent(this, externalNode, props);
  }

  static formatErrorMessage(component) {
    let tagName = component.type.tagName;
    if (tagName === null) {
      tagName = component.data.tagName;
    }

    if (component.data.className != null) {
      return tagName + ' className="' + component.data.className + '"';
    } else {
      return tagName;
    }
  }

  /*mountComponent() {
    if (this.contentInstance !== null) {
      this.contentInstance.mountContent();
    }
  }*/

  update(nextProps) {
    let lastProps = this.props;
    let node = this.node;

    let tagName = this.tagName;
    if (tagName != null) {
      if (nextProps.tagName !== undefined) {
        throw new Error;
      }
    } else {
      if (nextProps.tagName !== lastProps.tagName) {
        if (nextProps.tagName == null) {
          throw new Error;
        }
        throw new Error;
      }
    }

    this.updateElement(node, nextProps, lastProps);

    // TODO: Simplify this thing

    let nextChildren = nextProps.children;
    let lastChildren = lastProps.children;
    let nextContent = nextProps.content;
    let lastContent = lastProps.content;
    if (nextChildren != null) {
      if (nextContent != null) {
        throw new Error;
      }
      if (lastChildren != null) {
        this.contentInstance.update(nextChildren);
      } else {
        if (lastContent != null) {
          this.contentInstance.destroy();
          clearNodeChildren(node);
        }
        this.contentInstance = SurgicalPrearrangedContent.createContent(node, nextChildren);
      }
    } else if (nextContent != null) {
      if (lastContent != null) {
        if (nextContent.type !== lastContent.type ||
            nextContent.key !== lastContent.key) {
          this.contentInstance.destroy();
          clearNodeChildren(node);
          this.contentInstance = nextContent.type.createContent(node, nextContent.data);
        } else {
          this.contentInstance.update(nextContent.data);
        }
      } else {
        if (lastChildren != null) {
          this.contentInstance.destroy();
          clearNodeChildren(node);
        }
        this.contentInstance = nextContent.type.createContent(node, nextContent.data);
      }
    } else if (lastChildren != null || lastContent != null) {
      this.contentInstance.destroy();
      clearNodeChildren(node);
      this.contentInstance = null;
    }

    this.props = nextProps;
  }

  /*unmountComponent() {
    if (this.contentInstance !== null) {
      this.contentInstance.unmountContent();
    }
  }*/

  destroy() {
    this.destroyElement(this.node, this.props);

    if (this.contentInstance !== null) {
      this.contentInstance.destroy();
    }
  }
}

SurgicalBaseElement.tagName = null;
SurgicalBaseElement.namespaceURI = null;
