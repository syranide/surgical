import SurgicalElement from './SurgicalElement';
import {declare} from './declare';

export default function createElement(type, props) {
  let actualProps = Object.assign({}, props);
  if (arguments.length > 2) {
    actualProps.children = Array.prototype.slice.call(arguments, 2);
  }

  let actualType;
  if (typeof type === 'string') {
    actualType = SurgicalElement;
    actualProps.tagName = type;
  } else {
    actualType = type;
  }

  return declare(actualType, actualProps);
}
