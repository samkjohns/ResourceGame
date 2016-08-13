var React = require('react'),
    ReactDOM = require('react-dom'),

    GameDetail = require('./components/GameDetail'),
    Dimensions = require('./constants/dimensions.js'),
    Battle = require('./game/Battle'),
    Game = require('./game/Game');


var App = React.createClass({
  startGame: function () {
    this.context.clearRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);

    this.game = new Game(this.context);
    // this.battle = new Battle(
    //   // attackers (array)
    //   // defenders (array)
    //   // {tile: tileType}
    // );
  },

  componentDidMount: function () {
    this.context = document.getElementById("test").getContext('2d');

    window.clearCanvas = function () {
      this.context.clearRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);
      this.context.fillStyle = 'rgb(245, 245, 245)';
      this.context.fillRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);
    }.bind(this);

    this.loadImages();
  },

  loadImages: function () {
    var self = this;

    var loadFolder = function (fnameSources) {

      var fnameImages = fnameSources.replace("Sources", "") + "s";
      window.resourceImages[fnameImages] = {};
      var sourceFolder = window.resourceImages[fnameSources];
      var imageFolder = window.resourceImages[fnameImages];

      Object.keys(sourceFolder).forEach(function (source) {
        var img = new Image();
        img.src = sourceFolder[source];

        img.onload = function () {
          imageFolder[source] = img;
          self.loadedImages++;

          self.context.clearRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);

          self.context.font = '36px verdana';
          self.context.fillStyle = "rgb(0, 0, 0)";
          self.context.fillText(
            self.loadedImages + " / " + self.loaderCount + " loaded",
            (Dimensions.DIM_X / 2) - 100, Dimensions.DIM_Y / 2
          );

          if (self.loadedImages === self.loaderCount) {
            self.startGame();
          }
        }
      });

    };

    this.loaderCount =
      Object.keys(window.resourceImages.spriteSources).length +
      Object.keys(window.resourceImages.iconSources).length +
      Object.keys(window.resourceImages.tileSources).length;

    this.loadedImages = 0;

    loadFolder('tileSources');
    loadFolder('iconSources');
    loadFolder('spriteSources');
  },

  handleClick: function (evnt) {
    // if (this.nav.handleClick(evnt, this.map) || this.map.handleClick(evnt)) {
    //   // for now just rerender the map, but we can do better
    //   this.canvasRender();
    // }
    this.game.handleClick(evnt);
  },

  // this is for debugging
  handleHover: function (evnt) {
    // this.map.handleHover(evnt);
  },

  handleKey: function (evnt) {
    // if (evnt.key.startsWith('Arrow')) {
    //   var dir = evnt.key.split('Arrow')[1];
    //   this.map.handleKey(dir, this.canvasRender);
    //
    // } else if (evnt.key === "m") {
    //   this.map.move(this.canvasRender);
    // }
    this.game.handleKey(evnt);
  },

  render: function () {
    return(
      <div onKeyDown={this.handleKey}>
        <canvas
          tabIndex="1"
          id="test" width={Dimensions.DIM_X} height={Dimensions.DIM_Y}
          onClick={this.handleClick}
          onMouseMove={this.handleHover}
        ></canvas>
        <GameDetail/>
      </div>
    );
  }
});

document.addEventListener(
  "DOMContentLoaded",
  function () { ReactDOM.render(< App />, document.getElementById('app')); }
);
