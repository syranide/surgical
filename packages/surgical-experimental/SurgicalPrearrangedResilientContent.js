// import SurgicalText from './SurgicalText';
// import nodeInsertAfter from './private/nodeInsertAfter';

// // TODO: maybe not update prevNode when we're not inserting stuff
// //       for non-null-keys content it is easy to just read the following element instead
// //       this should be faster than reading current + nextSibling?
// // TODO: maybe just storing last non-null instance is measurably faster?

// export default class SurgicalPrearrangedContent {
//   static createContent(containerNode, components) {
//     let that = new SurgicalPrearrangedContent;

//     let instances = new Array(components.length);
//     let ownerDocument = containerNode.ownerDocument;

//     for (let i = 0; i < components.length; i++) {
//       let component = components[i];
//       if (component != null) {
//         if (component.type === SurgicalText) {
//           let text = '' + component.data;
//           let j;
//           for (j = i + 1; j < components.length; j++) {
//             let siblingComponent = components[j];
//             if (siblingComponent != null) {
//               if (siblingComponent.type !== SurgicalText) {
//                 break;
//               }

//               text += siblingComponent.data;
//             }
//             instances[j] = null;
//           }
//           i = j - 1;
//           instances[i] = null;
//           containerNode.appendChild(ownerDocument.createTextNode(text));
//         } else {
//           let instance = component.type.createComponent(ownerDocument, component.data);
//           containerNode.appendChild(instance.node);
//           instances[i] = instance;
//         }
//       } else {
//         // Make sure the array does not become sparse
//         instances[i] = null;
//       }
//     }

//     that.containerNode = containerNode;
//     that.components = components;
//     that.instances = instances;

//     return that;
//   }

//   /*static importContent(externalInstance, externalContainerNode) {
//     let that = new SurgicalPrearrangedContent;

//     let components = externalInstance.components;
//     let lastInstances = externalInstance.instances;
//     let nextInstances = new Array(components.length);

//     // TODO: faster with childNodex index instead of nextSibling?
//     let childNode = externalContainerNode.firstChild;
//     for (let i = 0; i < components.length; i++) {
//       let component = components[i];
//       if (component != null) {
//         nextInstances[i] = component.type.importComponent(lastInstances[i], childNode);
//         childNode = childNode.nextSibling;
//       } else {
//         // Make sure the array does not become sparse
//         nextInstances[i] = null;
//       }
//     }

//     that.containerNode = externalContainerNode;
//     that.components = components;
//     that.instances = nextInstances;
//     return that;
//   }*/

//   /*mountContent() {
//     let instances = this.instances;

//     for (let i = 0; i < instances.length; i++) {
//       let instance = instances[i];
//       if (instance !== null) {
//         instance.mountComponent();
//       }
//     }
//   }*/


//   update(nextComponents) {
//     let lastComponents = this.components;
//     // Reuse the instances array.  Only increase the size, never decrease.
//     // Size should very rarely fluctuate. It seems setting the length only
//     // affects performance negatively.
//     let instances = this.instances;
//     let containerNode = this.containerNode;
//     let ownerDocument = containerNode.ownerDocument;

//     for (let i = 0; i < lastComponents.length; i++) {
//       let lastComponent = lastComponents[i];

//       if (lastComponent != null) {
//         if (lastComponent.type !== SurgicalText) {
//           let nextComponent = nextComponents[i];
//           if (nextComponent == null ||
//               lastComponent.type !== nextComponent.type ||
//               lastComponent.key !== nextComponent.key) {
//             let lastInstance = instances[i];
//             lastInstance.destroy();
//             containerNode.removeChild(lastInstance.node);
//           }
//         }
//       }
//     }

//     let prevNode = null;
//     let textNode = null;
//     let thereIsPrevText = false;

//     for (let i = 0; i < nextComponents.length; i++) {
//       let nextComponent = nextComponents[i];
//       let lastComponent = lastComponents[i];

//       if (lastComponent != null) {
//         if (lastComponent.type === SurgicalText) {
//           if (prevNode === null) {
//             if (containerNode.firstChild != null &&
//                 containerNode.firstChild.nodeType === 3 /*Element.TEXT_NODE*/) {
//               textNode = containerNode.firstChild;
//             }
//           } else {
//             if (prevNode.nextSibling != null &&
//                 prevNode.nextSibling.nodeType === 3 /*Element.TEXT_NODE*/) {
//               textNode = prevNode.nextSibling;
//             }
//           }
//         }
//       }

//       if (nextComponent != null) {
//         if (nextComponent.type === SurgicalText) {
//           let same = true;
//           if (thereIsPrevText) {
//             same = false;
//           } else {
//             let length = Math.max(nextComponents.length, lastComponents.length);

//             for (let j = i; j < length; j++) {
//               let nextSiblingComponent = nextComponents[j];
//               let lastSiblingComponent = lastComponents[j];
//               if (nextSiblingComponent != null) {
//                 if (lastSiblingComponent == null) {
//                   same = false;
//                   break;
//                 }
//               } else if (lastSiblingComponent != null) {
//                 same = false;
//                 break;
//               }
//               if (nextSiblingComponent.type !== SurgicalText) {
//                 if (lastSiblingComponent.type === SurgicalText) {
//                   same = false;
//                   break;
//                 }
//                 break;
//               } else if (lastSiblingComponent.type !== SurgicalText) {
//                 same = false;
//                 break;
//               }
//               if (nextSiblingComponent.data !== lastSiblingComponent.data) {
//                 same = false;
//                 break;
//               }
//             }
//           }

//           if (!same) {
//             let nextText = '';
//             let j;
//             for (j = i; j < nextComponents.length; j++) {
//               let nextSiblingComponent = nextComponents[j];
//               if (nextSiblingComponent != null) {
//                 if (nextSiblingComponent.type !== SurgicalText) {
//                   break;
//                 }
//                 nextText += nextSiblingComponent.data;
//               }
//               instances[j] = null;
//             }
//             i = j - 1;
//             console.log('update text', nextText);
//             textNode.data = nextText;
//           } else {
//             let j;
//             for (j = i; j < nextComponents.length; j++) {
//               let nextSiblingComponent = nextComponents[j];
//               if (nextSiblingComponent != null) {
//                 if (nextSiblingComponent.type !== SurgicalText) {
//                   break;
//                 }
//               }
//               instances[j] = null;
//             }
//             i = j - 1;
//             console.log('same text', textNode.data);
//           }
//           prevNode = textNode;
//           textNode = null;
//           continue;
//         }
//       }

//       if (lastComponent != null) {
//         if (lastComponent.type === SurgicalText) {
//           thereIsPrevText = true;
//         } else {
//           thereIsPrevText = false;
//         }
//       }

//       if (nextComponent != null) {
//         if (nextComponent.type === SurgicalText) {
//           let node;
//           if (lastComponent == null ||
//               lastComponent.type !== SurgicalText) {
//             node = ownerDocument.createTextNode(component.data)
//             nodeInsertAfter(containerNode, node, prevNode);
//             instances[i] = node;
//           } else if (nextComponent.data !== lastComponent.data) {
//             node = instances[i];
//             node.data = nextComponent.data;
//           }
//           prevNode = node;
//         } else {
//           if (textNode != null) {
//            //console.log("remove text", textNode.data);
//             //console.log("OIJ");
//             while (textNode.nextSibling && textNode.nextSibling.nodeType === 3) {

//               containerNode.removeChild(textNode.nextSibling);
//             }

//             containerNode.removeChild(textNode);
//             // remove all adjacent too
//           }

//           let nextInstance;
//           if (lastComponent == null ||
//               nextComponent.type !== lastComponent.type ||
//               nextComponent.key !== lastComponent.key) {
//             nextInstance = nextComponent.type.createComponent(ownerDocument, nextComponent.data);
//             nodeInsertAfter(containerNode, nextInstance.node, prevNode);
//             instances[i] = nextInstance;
//           } else {
//             nextInstance = instances[i];
//             nextInstance.update(nextComponent.data);
//           }

//           prevNode = nextInstance.node;
//           textNode = null;
//         }
//       } else {
//         // Make sure the array does not become sparse
//         instances[i] = null;
//       }
//     }

//     if (textNode != null) {
//       //console.log("remove last text", textNode.data);
//       while (textNode.nextSibling && textNode.nextSibling.nodeType === 3) {
//         containerNode.removeChild(textNode.nextSibling);
//       }
//       containerNode.removeChild(textNode);
//       // remove all adjacent too
//     }

//     this.components = nextComponents;
//     this.instances = instances;
//   }

//   /*unmountContent() {
//     let instances = this.instances;

//     for (let i = 0; i < instances.length; i++) {
//       let instance = instances[i];
//       if (instance !== null) {
//         instance.unmountComponent();
//       }
//     }
//   }*/

//   destroy() {
//     let instances = this.instances;

//     for (let i = 0; i < instances.length; i++) {
//       let instance = instances[i];
//       if (instance !== null) {
//         instance.destroy();
//       }
//     }
//   }

//   destroyNodes() {
//     let containerNode = this.containerNode;
//     let instances = this.instances;

//     for (let i = 0; i < instances.length; i++) {
//       let instance = instances[i];
//       if (instance !== null) {
//         instance.destroy();
//         // TODO: maybe remove separately, in reverse order
//         containerNode.removeChild(instance.node);
//       }
//     }
//   }
// }
