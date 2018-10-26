// TODO: This is bad, message can be read-only and not be allowed to be overwritten.
//       But it's always safe to add new stuff to the error-message
export default function enhanceError(e, method, component) {
  let extra = '';
  if (component.type.formatErrorMessage !== undefined) {
    extra = ' [' + component.type.formatErrorMessage(component) + ']';
  }

  let str = '@ ' + component.type.name + '.' + method  + extra/* + ' (unknown)'*/;

  //console.error(component.error);

  if (e.surgicalStack === undefined) {
    e.surgicalStack = str;
  } else {
    e.surgicalStack += '\n' + str;
  }

  // IE/IEdge does not support changing "message", but "description" works.
  /*if ('description' in e) {
    e.description += '\n' + str;
  }

  e.message += '\n' + str;*/

  return e;
}

// TODO: Does not work for cross-scripting errors
/*window.addEventListener('error', (e) => {
  if (e.error != null && e.error.surgicalStack !== undefined) {
    //console.error(('' + e.error) + '\n' + e.error.surgicalStack + '\n' + e.filename + ':' + e.lineno);
    console.error(('' + e.error) + '\n' + e.error.surgicalStack);
  }
});*/

