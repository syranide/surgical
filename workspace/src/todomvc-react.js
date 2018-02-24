'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from '../todomvc/js/director';
import '../todomvc/js/utils';
import '../todomvc/js/todoModel';

var app = window.app;

app.ALL_TODOS = 'all';
app.ACTIVE_TODOS = 'active';
app.COMPLETED_TODOS = 'completed';

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowShowing: app.ALL_TODOS,
      editing: null,
      newTodo: ''
    };
  }

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.state.newTodo.trim();

    if (val) {
      this.props.model.addTodo(val);
      this.setState({ newTodo: '' });
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
    this.setState({ editing: todo.id });
  }

  save(todoToSave, text) {
    this.props.model.save(todoToSave, text);
    this.setState({ editing: null });
  }

  cancel() {
    this.setState({ editing: null });
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
        todoItems.push(React.createElement(TodoItem, {
          key: todo.id,
          todo: todo,
          onToggle: this.toggle.bind(this, todo),
          onDestroy: this.destroy.bind(this, todo),
          onEdit: this.edit.bind(this, todo),
          editing: this.state.editing === todo.id,
          onSave: this.save.bind(this, todo),
          onCancel: this.cancel.bind(this)
        }));
      }
    }

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = React.createElement(TodoFooter, {
        count: activeTodoCount,
        completedCount: completedCount,
        nowShowing: this.state.nowShowing,
        onClearCompleted: this.clearCompleted.bind(this)
      });
    }

    if (todoItems.length) {
      main = React.createElement(
        'section',
        { className: 'main' },
        React.createElement('input', {
          className: 'toggle-all',
          type: 'checkbox',
          onChange: this.toggleAll.bind(this),
          checked: activeTodoCount === 0
        }),
        React.createElement(
          'ul',
          { className: 'todo-list' },
          todoItems
        )
      );
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        { className: 'header' },
        React.createElement(
          'h1',
          null,
          'todos'
        ),
        React.createElement('input', {
          className: 'new-todo',
          placeholder: 'What needs to be done?',
          value: this.state.newTodo,
          onKeyDown: this.handleNewTodoKeyDown.bind(this),
          onChange: this.handleChange.bind(this),
          autoFocus: true
        })
      ),
      main,
      footer
    );
  }
}



class TodoItem extends React.Component {
  handleSubmit(event) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    } else {
      this.props.onDestroy();
    }
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }*/

  handleEdit() {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  }

  handleKeyDown(event) {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange(event) {
    if (this.props.editing) {
      this.setState({ editText: event.target.value });
    }
  }

  constructor(props) {
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  /**
 * This is a completely optional performance enhancement that you can
 * implement on any React component. If you were to delete this method
 * the app would still work correctly (and still be very performant!), we
 * just use it as an example of how little code it takes to get an order
 * of magnitude performance improvement.
 */
  /*shouldComponentUpdate(nextProps, nextState) {
    return nextProps.todo !== this.props.todo || nextProps.editing !== this.props.editing || nextState.editText !== this.state.editText;
  }*/

  /**
 * Safely manipulate the DOM after updating the state when invoking
 * `this.props.onEdit()` in the `handleEdit` method above.
 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
 */
  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      var node = ReactDOM.findDOMNode(this.editField);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  render() {
    return React.createElement(
      "li",
      { className: (
        (this.props.todo.completed ? 'completed' : '') + ' ' +
        (this.props.editing ? 'editing' : '')
      )},
      React.createElement(
        "div",
        { className: "view" },
        React.createElement("input", {
          className: "toggle",
          type: "checkbox",
          checked: this.props.todo.completed,
          onChange: this.props.onToggle.bind(this)
        }),
        React.createElement(
          "label",
          { onDoubleClick: this.handleEdit.bind(this) },
          this.props.todo.title
        ),
        React.createElement("button", { className: "destroy", onClick: this.props.onDestroy })
      ),
      React.createElement("input", {
        ref: (node) => this.editField = node,
        className: "edit",
        value: this.state.editText,
        onBlur: this.handleSubmit.bind(this),
        onChange: this.handleChange.bind(this),
        onKeyDown: this.handleKeyDown.bind(this)
      })
    );
  }
}




class TodoFooter extends React.Component {
  render() {
    var activeTodoWord = app.Utils.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = React.createElement(
        'button',
        {
          className: 'clear-completed',
          onClick: this.props.onClearCompleted },
        'Clear completed'
      );
    }

    var nowShowing = this.props.nowShowing;
    return React.createElement(
      'footer',
      { className: 'footer' },
      React.createElement(
        'span',
        { className: 'todo-count' },
        React.createElement(
          'strong',
          null,
          this.props.count
        ),
        ' ',
        activeTodoWord,
        ' left'
      ),
      React.createElement(
        'ul',
        { className: 'filters' },
        React.createElement(
          'li',
          null,
          React.createElement(
            'a',
            {
              href: '#/',
              className: nowShowing === app.ALL_TODOS ? 'selected' : '' },
            'All'
          )
        ),
        ' ',
        React.createElement(
          'li',
          null,
          React.createElement(
            'a',
            {
              href: '#/active',
              className: nowShowing === app.ACTIVE_TODOS ? 'selected' : '' },
            'Active'
          )
        ),
        ' ',
        React.createElement(
          'li',
          null,
          React.createElement(
            'a',
            {
              href: '#/completed',
              className: nowShowing === app.COMPLETED_TODOS ? 'selected' : '' },
            'Completed'
          )
        )
      ),
      clearButton
    );
  }
}


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
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
  });


  refreshTime = measure('refresh', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
  });


  for (let i = 0; i < 100; i++) {
    model.addTodo('testB' + i);
  }

  updateTime = measure('update', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
  });

  refresh2Time = measure('refresh2', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
  });

  model.todos = model.todos.slice(100);

  deleteTime = measure('delete', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
  });

  model.subscribe(() => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
  });

  let router = Router({
    '/': () => {
      ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), document.getElementsByClassName('todoapp')[0]);
   },
    '/active': () => {
      ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ACTIVE_TODOS }), document.getElementsByClassName('todoapp')[0]);
    },
    '/completed': () => {
      ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.COMPLETED_TODOS }), document.getElementsByClassName('todoapp')[0]);
    },
  });
  router.init('/');
}


window.benchmark = (rootNode) => {
  var model = new app.TodoModel('react-todos');
  let instance;

  for (let i = 0; i < 100; i++) {
    model.addTodo('testA' + i);
  }

  let createTime = measure('create', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), rootNode);
  });

  let refreshTime = measure('refresh', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), rootNode);
  });


  for (let i = 0; i < 100; i++) {
    model.addTodo('testB' + i);
  }

  let updateTime = measure('update', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), rootNode);
  });

  let refresh2Time = measure('refresh2', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), rootNode);
  });

  model.todos = model.todos.slice(100);

  let deleteTime = measure('delete', () => {
    ReactDOM.render(React.createElement(TodoApp, { model: model, nowShowing: app.ALL_TODOS }), rootNode);
  });

  ReactDOM.unmountComponentAtNode(rootNode);

  return {
    createTime,
    refreshTime,
    updateTime,
    refresh2Time,
    deleteTime,
  };
};



window.benchmark = {
  'create100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }
    },
    run(rootNode, env) {
      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    teardown(rootNode, env) {
      ReactDOM.unmountComponentAtNode(rootNode);
    },
  },
  'refresh100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }

      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    run(rootNode, env) {
      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    teardown(rootNode, env) {
      ReactDOM.unmountComponentAtNode(rootNode);
    },
  },
  'update100+100': {
    setup(rootNode, env) {
      env.model = new app.TodoModel('react-todos');
      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testA' + i);
      }

      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);

      for (let i = 0; i < 100; i++) {
        env.model.addTodo('testB' + i);
      }
    },
    run(rootNode, env) {
      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    teardown(rootNode, env) {
      ReactDOM.unmountComponentAtNode(rootNode);
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

      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    run(rootNode, env) {
      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    teardown(rootNode, env) {
      ReactDOM.unmountComponentAtNode(rootNode);
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

      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);

      env.model.todos = env.model.todos.slice(100);
    },
    run(rootNode, env) {
      ReactDOM.render(React.createElement(TodoApp, { model: env.model, nowShowing: app.ALL_TODOS }), rootNode);
    },
    teardown(rootNode, env) {
      ReactDOM.unmountComponentAtNode(rootNode);
    },
  },
};


if (!window.is_benchmark) {
  next();
}
