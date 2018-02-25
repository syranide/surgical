import {declare} from './declare';

export default function createElement(type, props) {
  let actualProps = Object.assign({}, props);
  if (arguments.length > 2) {
    actualProps.children = Array.prototype.slice.call(arguments, 2);
  }

  return declare(type, actualProps);
}
