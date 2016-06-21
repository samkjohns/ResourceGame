var React = require('react'),
    ReactDOM = require('react-dom'),
    Creature = require('./game/Creature'),
    Move = require('./game/Move'),
    Battlefield = require('./game/Battlefield');

var DIM_X = 1250,
    DIM_Y = 800;

var App = React.createClass({
  componentDidMount: function () {
    this.context = document.getElementById("test").getContext('2d');
    // this.context.fillRect(0, 0, DIM_X, DIM_Y);
    // Battlefield.prototype.render(this.context);

    window.battlefield = new Battlefield();
    window.battlefield.render(this.context);
  },

  render: function () {
    return(
      <div>
        <canvas id="test" width={DIM_X} height={DIM_Y}></canvas>
      </div>
    );
  }
});

window.Creature = Creature;
window.Move = Move;

document.addEventListener(
  "DOMContentLoaded",
  function () { ReactDOM.render(< App />, document.getElementById('app')); }
);
