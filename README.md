
# Surgical &nbsp;[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/syranide/surgical/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/surgical.svg?style=flat)](https://www.npmjs.com/package/surgical)

**Surgical is a declarative JavaScript library with native DOM flexibility and performance, for building fast UIs.**

Surgical is exceptionally modular and highly granular; use it to declaratively update a single attribute of an element or render an entire interactive UI just like you would with React. The Surgical core is unopinionated by design and interoperates seamlessly with the native DOM, other frameworks and even different versions of Surgical. Opinionated and ergonomic behaviors for achieving your specific project goals are trivially layered on-top of Surgical. Surgical is the native DOM, but declarative.

Not much to see here yet. **Moving fast and breaking things.**

# Important

Source/NPM files are in ES6 syntax and also uses `import`, `export`. Depends on `Object.assign`, `Object.is`, `Object.keys` and `Map`. Only IE11+ officially supported at the moment, official IE9 support is planned but it should work with the correct polyfills. Google Closure Compiler `ADVANCED` support is planned.

# Getting started

More information and examples to come, expect things to change.

For a reasonably complete example look at the TodoMVC implementation:
[workspace/src/todomvc-surgical.js](workspace/src/todomvc-surgical.js)

Below is a minimal example for getting started.

```js
import SurgicalDeclarativeComponent from 'surgical/SurgicalDeclarativeComponent';
import SurgicalElement from 'surgical/SurgicalElement';
import SurgicalText from 'surgical/SurgicalText';
import {declare} from 'surgical/declare';

class MyExample extends SurgicalDeclarativeComponent {
  handleClick() {
    console.log('You clicked me!');
  }
  render() {
    return (
      declare(SurgicalElement, {
        tagName: 'button',
        className: 'my-button-class',
        listeners: {
          'click': this.handleClick.bind(this)},
        children: [
          declare(SurgicalText, this.props.label),
        ],
      })
    );
  }
}

let instance = MyExample.createComponent(document, {label: 'Click me!'});
document.body.appendChild(instance.node);
instance.update({label: 'Click me! Now!'});
// instance.destroy();
```
