import SurgicalDeclarativeComponent from '../../packages/surgical/SurgicalDeclarativeComponent';
import SurgicalDeclarativeCloneComponent from '../../packages/surgical-experimental/SurgicalDeclarativeCloneComponent';
import SurgicalIdentityComponent from '../../packages/surgical/SurgicalIdentityComponent';

import SurgicalElement from '../../packages/surgical/SurgicalElement';
import SurgicalText from '../../packages/surgical/SurgicalText';
import SurgicalPrearrangedContent from '../../packages/surgical/SurgicalPrearrangedContent';
import SurgicalReorderableMoveDownContent from '../../packages/surgical/SurgicalReorderableMoveDownContent';
import SurgicalInstanceRef from '../../packages/surgical/SurgicalInstanceRef';
import createRef from '../../packages/surgical/createRef';

import {declare as declare,
        declareWithKey,
        declareContent,
        declareContentWithKey} from '../../packages/surgical/declare.js';



import {Router} from '../todomvc/js/director';
import '../todomvc/js/utils';
import '../todomvc/js/todoModel';

import objectEqual from './objectEqual';

// Temporary, use {...this.state} in real code
function objectSpread(source1, source2) {
  return Object.assign({}, source1, source2);
}


/*let dummyFunction = function() {};

function optionalCallback(callback) {
  if (callback == null) {
    return dummyFunction;
  }
  return callback;
};*/


class ControlledInputTextComponent extends SurgicalElement {
  createElement(node, props) {
    super.createElement(node, props);

    if (typeof props.value !== 'string') {
      throw new Error;
    }

    node.value = props.value;
  }

  updateElement(node, nextProps, lastProps) {
    super.updateElement(node, nextProps, lastProps);

    if (typeof nextProps.value !== 'string') {
      throw new Error;
    }

    if (node.value !== nextProps.value) {
      node.value = nextProps.value;
    }
  }

  destroyElement(node, lastProps) {
    super.destroyElement(node, lastProps);
  }
}

ControlledInputTextComponent.tagName = 'input';


class ControlledInputCheckboxComponent extends SurgicalElement {
  createElement(node, props) {
    super.createElement(node, props);

    if (typeof props.checked !== 'boolean') {
      throw new Error;
    }

    node.checked = props.checked;
  }

  updateElement(node, nextProps, lastProps) {
    super.updateElement(node, nextProps, lastProps);

    if (typeof nextProps.checked !== 'boolean') {
      throw new Error;
    }

    if (node.checked !== nextProps.checked) {
      node.checked = nextProps.checked;
    }
  }

  destroyElement(node, lastProps) {
    super.destroyElement(node, lastProps);
  }
}

ControlledInputCheckboxComponent.tagName = 'input';






var app = window.app;

app.ALL_TODOS = 'all';
app.ACTIVE_TODOS = 'active';
app.COMPLETED_TODOS = 'completed';

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;




class TodoApp extends SurgicalDeclarativeComponent {
  componentBeforeCreate() {
    this.state = {
      nowShowing: app.ALL_TODOS,
      editing: null,
      newTodo: '',
    };
  }

  handleChange(event) {
    this.state = objectSpread(this.state, {
      newTodo: event.target.value,
    });
    this.renderStateChange();
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.state.newTodo.trim();

    if (val) {
      this.state = objectSpread(this.state, {
        newTodo: '',
      });
      this.props.model.addTodo(val);
      this.renderStateChange();
    }
  }

  toggleAll(event) {
    var checked = event.target.checked;
    this.props.model.toggleAll(checked);
  }

  toggle(todoToToggle) {
    this.props.model.toggle(todoToToggle);
  }

  destroy(todo) {
    this.props.model.destroy(todo);
  }

  edit(todo) {
    this.state = objectSpread(this.state, {
      editing: todo.id,
    });
    this.renderStateChange();
  }

  save(todoToSave, text) {
    this.state = objectSpread(this.state, {
      editing: null,
    });
    this.props.model.save(todoToSave, text);
    this.renderStateChange();
  }

  cancel() {
    this.state = objectSpread(this.state, {
      editing: null,
    });
    this.renderStateChange();
  }

  clearCompleted() {
    this.props.model.clearCompleted();
  }

  render() {
    var footer;
    var main;
    var todoItems = [];
    var todos = this.props.model.todos;
    var activeTodoCount = 0;

    for (let i = 0; i < todos.length; i++) {
      let todo = todos[i];
      if (!todo.completed) {
        activeTodoCount++;
      }
      if (this.props.nowShowing === app.ALL_TODOS ||
          this.props.nowShowing === app.ACTIVE_TODOS && !todo.completed ||
          this.props.nowShowing === app.COMPLETED_TODOS && todo.completed) {
        todoItems.push(
          declareWithKey(TodoItem, todo.id, {
            todo: todo,
            onToggle: this.toggle.bind(this, todo),
            onDestroy: this.destroy.bind(this, todo),
            onEdit: this.edit.bind(this, todo),
            editing: this.state.editing === todo.id,
            onSave: this.save.bind(this, todo),
            onCancel: this.cancel.bind(this),
          }) //TodoItem
        );
      }
    }

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = (
        declare(TodoFooter, {
          count: activeTodoCount,
          completedCount: completedCount,
          nowShowing: this.props.nowShowing,
          onClearCompleted: this.clearCompleted.bind(this),
        }) //TodoFooter
      );
    }

    if (todoItems.length) {
      main = (
        declare(SurgicalElement, {
          tagName: 'section',
          className: 'main',
          children: [
            declare(ControlledInputCheckboxComponent, {
              className: 'toggle-all',
              checked: activeTodoCount === 0,
              attributes: {
                'type': 'checkbox'},
              listeners: {
                'change': this.toggleAll.bind(this)},
            }), //input
            declare(SurgicalElement, {
              tagName: 'ul',
              className: 'todo-list',
              content: (
                declareContent(SurgicalReorderableMoveDownContent, todoItems)
              ),
            }), //ul
          ],
        }) //section
      );
    }

    return (
      declare(SurgicalElement, {
        tagName: 'div',
        children: [
          declare(SurgicalElement, {
            tagName: 'header',
            className: 'header',
            children: [
              declare(SurgicalElement, {
                tagName: 'h1',
                children: [
                  declare(SurgicalText, 'todos'),
                ],
              }), //h1
              declare(ControlledInputTextComponent, {
                value: this.state.newTodo,
                className: 'new-todo',
                attributes: {
                  'placeholder': 'What needs to be done?',
                  'autofocus': true},
                listeners: {
                  'keydown': this.handleNewTodoKeyDown.bind(this),
                  'input': this.handleChange.bind(this)},
              }), //input
            ],
          }), //header
          main,
          footer,
        ],
      }) //div
    );
  }
}

class TodoItem extends SurgicalDeclarativeComponent {
  componentBeforeCreate() {
    this.state = {
      editText: this.props.todo.title,
    };
    this.editFieldRef = createRef();
  }

  componentUpdate(lastProps, lastState) {
    /*if (this.state !== lastState ||
        this.props !== lastProps &&
        (this.props.editing !== lastProps.editing ||
         this.props.editText !== lastProps.editText ||
         this.props.todo !== lastProps.todo)) {
      this.forceRender();
    }*/

    this.forceRender();

    if (this.props.editing && !lastProps.editing) {
      var node = this.editFieldRef.value.node;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  handleSubmit(event) {
    var val = this.state.editText.trim();
    if (val) {
      this.state = objectSpread(this.state, {
        editText: val
      });
      this.props.onSave(val);
      this.renderStateChange();
    } else {
      this.props.onDestroy();
    }
  }

  handleEdit() {
    this.state = objectSpread(this.state, {
      editText: this.props.todo.title
    });
    this.props.onEdit();
    this.renderStateChange();
  }

  handleKeyDown(event) {
    if (event.which === ESCAPE_KEY) {
      this.state = objectSpread(this.state, {
        editText: this.props.todo.title,
      });
      this.props.onCancel(event);
      this.renderStateChange();
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange(event) {
    if (this.props.editing) {
      this.state = objectSpread(this.state, {
        editText: event.target.value,
      });
      this.renderStateChange();
    }
  }

  render() {
    return (
      declare(SurgicalElement, {
        tagName: 'li',
        className: (
          (this.props.todo.completed ? 'completed' : '') + ' ' +
          (this.props.editing ? 'editing' : '')),
        children: [
          declare(SurgicalElement, {
            tagName: 'div',
            className: 'view',
            children: [
              declare(ControlledInputCheckboxComponent, {
                className: 'toggle',
                checked: this.props.todo.completed,
                attributes: {
                  'type': 'checkbox'},
                listeners: {
                  'change': this.props.onToggle},
              }), //input
              declare(SurgicalElement, {
                tagName: 'label',
                listeners: {
                  'dblclick': this.handleEdit.bind(this)},
                children: [
                  declare(SurgicalText, this.props.todo.title),
                ],
              }), //label
              declare(SurgicalElement, {
                tagName: 'button',
                className: 'destroy',
                listeners: {
                  'click': this.props.onDestroy},
              }), //button
            ],
          }), //div
          //(this.props.editing ?
            declare(SurgicalInstanceRef, {
              ref: this.editFieldRef,
              child: (
                declare(ControlledInputTextComponent, {
                  value: this.state.editText,
                  className: 'edit',
                  listeners: {
                    'blur': this.handleSubmit.bind(this),
                    'change': this.handleChange.bind(this),
                    'keydown': this.handleKeyDown.bind(this)},
                }) //input
              ),
            })
          //: null)
        ],
      }) //li
    );
  }
}

class TodoFooter extends SurgicalDeclarativeComponent {
  render() {
    var activeTodoWord = app.Utils.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        declare(SurgicalElement, {
          tagName: 'button',
          className: 'clear-completed',
          listeners: {
            'click': this.props.onClearCompleted},
          children: [
            declare(SurgicalText, 'Clear completed'),
          ],
        }) // button
      );
    }

    var nowShowing = this.props.nowShowing;

    return (
      declare(SurgicalElement, {
        tagName: 'footer',
        className: 'footer',
        children: [
          declare(SurgicalElement, {
            tagName: 'span',
            className: 'todo-count',
            children: [
              declare(SurgicalElement, {
                tagName: 'strong',
                children: [
                  declare(SurgicalText, this.props.count),
                ],
              }), //strong
              declare(SurgicalText, ' ' + activeTodoWord + ' left'),
            ],
          }), //span
          declare(SurgicalElement, {
            tagName: 'ul',
            className: 'filters',
            children: [
              declare(SurgicalElement, {
                tagName: 'li',
                children: [
                  declare(SurgicalElement, {
                    tagName: 'a',
                    className: nowShowing === app.ALL_TODOS ? 'selected' : '',
                    attributes: {
                      'href': '#/'},
                    children: [
                      declare(SurgicalText, 'All'),
                    ],
                  }), //a
                ],
              }), //li
              declare(SurgicalText, ' '),
              declare(SurgicalElement, {
                tagName: 'li',
                children: [
                  declare(SurgicalElement, {
                    tagName: 'a',
                    className: nowShowing === app.ACTIVE_TODOS ? 'selected' : '',
                    attributes: {
                      'href': '#/active'},
                    children: [
                      declare(SurgicalText, 'Active'),
                    ],
                  }), //a
                ],
              }), //li
              declare(SurgicalText, ' '),
              declare(SurgicalElement, {
                tagName: 'li',
                children: [
                  declare(SurgicalElement, {
                    tagName: 'a',
                    className: nowShowing === app.COMPLETED_TODOS ? 'selected' : '',
                    attributes: {
                      'href': '#/completed'},
                    children: [
                      declare(SurgicalText, 'Completed'),
                    ],
                  }), //a
                ],
              }), //li
            ],
          }), //ul
          clearButton,
        ],
      }) //footer
    );
  }
}





/*let router = Router({
  '/': () => {
    instance.update({
      model: model,
      nowShowing: app.ALL_TODOS
    });
  },
  '/active': () => {
    instance.update({
      model: model,
      nowShowing: app.ACTIVE_TODOS
    });
  },
  '/completed': () => {
    instance.update({
      model: model,
      nowShowing: app.COMPLETED_TODOS
    });
  },
});
router.init('/');*/


/*
model.subscribe(() => {

});*/
function measure(name, callback) {
  performance.mark(name + "-start");

  callback();

  performance.mark(name + "-end");
  performance.measure(name, name + "-start", name + "-end");
  let measure = performance.getEntriesByName(name)[0];
  performance.clearMarks();
  performance.clearMeasures();
  return measure.duration;
}


function instantiateContent(containerNode, content) {
  return content.type.createContent(containerNode, content.data);
}

function instantiateComponent(ownerDocument, element) {
  return element.type.createComponent(ownerDocument, element.data);
}



function next() {
  let instance;
  let createTime;
  let refreshTime;
  let updateTime;
  let refresh2Time;
  let deleteTime;


  var model = new app.TodoModel('react-todos');

  for (let i = 0; i < 100; i++) {
    model.addTodo('testA' + i);
  }

  createTime = measure('create', () => {
    instance = TodoApp.createComponent(document, {
      nowShowing: app.ALL_TODOS,
      model: model,
    });

    document.getElementsByClassName('todoapp')[0].appendChild(instance.node);
  });


  refreshTime = measure('refresh', () => {
    instance.update({
      nowShowing: app.ALL_TODOS,
      model: model,
    });
  });


  for (let i = 0; i < 100; i++) {
    model.addTodo('testB' + i);
  }

  updateTime = measure('update', () => {
    instance.update({
      nowShowing: app.ALL_TODOS,
      model: model,
    });
  });

  refresh2Time = measure('refresh2', () => {
    instance.update({
      nowShowing: app.ALL_TODOS,
      model: model,
    });
  });

  model.todos = model.todos.slice(100);

  deleteTime = measure('delete', () => {
    instance.update({
      nowShowing: app.ALL_TODOS,
      model: model,
    });
  });

  model.subscribe(() => {
    instance.update({
      nowShowing: app.ALL_TODOS,
      model: model,
    });
  });

  let router = Router({
    '/': () => {
      instance.update({
        model: model,
        nowShowing: app.ALL_TODOS
      });
    },
    '/active': () => {
      instance.update({
        model: model,
        nowShowing: app.ACTIVE_TODOS
      });
    },
    '/completed': () => {
      instance.update({
        model: model,
        nowShowing: app.COMPLETED_TODOS
      });
    },
  });
  router.init('/');
}




window.benchmark = {
  'create100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }
    },
    run(rootNode, env) {
      env.instance = TodoApp.createComponent(document, {
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });

      rootNode.appendChild(env.instance.node);
    },
    teardown(rootNode, env) {
      env.instance.destroy();
      rootNode.removeChild(env.instance.node);
    },
  },
  'refresh100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }

      env.instance = TodoApp.createComponent(document, {
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });

      rootNode.appendChild(env.instance.node);
    },
    run(rootNode, env) {
      env.instance.update({
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });
    },
    teardown(rootNode, env) {
      env.instance.destroy();
      rootNode.removeChild(env.instance.node);
    },
  },
  'update100+100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }

      env.instance = TodoApp.createComponent(document, {
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });

      rootNode.appendChild(env.instance.node);

      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testB' + i);
      }
    },
    run(rootNode, env) {
      env.instance.update({
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });
    },
    teardown(rootNode, env) {
      env.instance.destroy();
      rootNode.removeChild(env.instance.node);
    },
  },
  'refresh200': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }

      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testB' + i);
      }

      env.instance = TodoApp.createComponent(document, {
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });

      rootNode.appendChild(env.instance.node);
    },
    run(rootNode, env) {
      env.instance.update({
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });
    },
    teardown(rootNode, env) {
      env.instance.destroy();
      rootNode.removeChild(env.instance.node);
    },
  },
  'delete200-100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }

      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testB' + i);
      }

      env.instance = TodoApp.createComponent(document, {
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });

      rootNode.appendChild(env.instance.node);

      env.model.todos = env.model.todos.slice(100);
    },
    run(rootNode, env) {
      env.instance.update({
        nowShowing: app.ALL_TODOS,
        model: env.model,
      });
    },
    teardown(rootNode, env) {
      env.instance.destroy();
      rootNode.removeChild(env.instance.node);
    },
  },
};


if (!window.is_benchmark) {
  next();
}
