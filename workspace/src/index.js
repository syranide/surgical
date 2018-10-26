if (window.MODE === 'benchmark') {
  require('./benchmark');
} else if (window.MODE === 'todomvc-surgical') {
  require('./todomvc-surgical');
} else if (window.MODE === 'todomvc-react') {
  //require('./todomvc-react');
} else {
  require('./playground');
}
