var React = require('react'),
    ReactDOM = require('react-dom');

var App = React.createClass({
  render: function () {
    return <div>APP</div>;
  }
});

document.addEventListener(
  "DOMContentLoaded",
  function () { ReactDOM.render(< App />, document.getElementById('app')); }
);
