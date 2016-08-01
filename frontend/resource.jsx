var React = require('react'),
    ReactDOM = require('react-dom'),
    Dimensions = require('./constants/dimensions.js'),
    Creature = require('./game/Creature'),
    Move = require('./game/Move'),
    Battlefield = require('./game/Battlefield'),
    NavMap = require('./game/NavMap'),
    GameMap = require('./game/GameMap'),

    MapGenerator = require('./util/MapGenerator.js');

var App = React.createClass({
  startGame: function () {
    this.context.fillRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);

    var settlement = { image: window.resourceImages.icons.settlement };
    this.map.placeVisitableObjectAt(0, 0, settlement);
    this.map.placeVisitableObjectAt(4, 4, settlement);
    this.map.placeVisitableObjectAt(4, 5, settlement);
    this.map.placeVisitableObjectAt(4, 6, settlement);
    this.map.placeVisitableObjectAt(4, 3, settlement);
    this.map.placeVisitableObjectAt(4, 2, settlement);
    this.map.placeVisitableObjectAt(5, 2, settlement);
    this.map.placeVisitableObjectAt(6, 2, settlement);

    this.map.placeCreatureAt(0, 1, new Creature(
      'humanoid', 'dark', {}, {},
      window.resourceImages.sprites.darkElemental
    ));
    this.map.discover(0, 1);

    this.map.placeCreatureAt(1, 2, new Creature(
      'humanoid', 'fire', {}, {},
      window.resourceImages.sprites.fireElemental
    ));

    this.map.placeCreatureAt(5, 30, new Creature(
      'humanoid', 'fire', {}, {},
      window.resourceImages.sprites.fireElemental
    ));

    this.canvasRender();
  },

  componentDidMount: function () {
    this.context = document.getElementById("test").getContext('2d');
    this.context.fillStyle = "rgb(255, 255, 255)";
    var gResult = generateMap(50, 50, 3);
    this.map = new GameMap(gResult.grid);
    window.clearCanvas = function () {
      this.context.clearRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);
    }.bind(this);
    window.map = this.map;

    this.nav = new NavMap(this.map.hexGameMap);
    window.nav = this.nav;

    this.loadImages();
  },

  loadImages: function () {
    var loadFolder = function (fnameSources) {
      var fnameImages = fnameSources.replace("Sources", "") + "s";
      window.resourceImages[fnameImages] = {};

      Object.keys(window.resourceImages[fnameSources]).forEach(function (source) {
        var img = new Image();
        img.src = window.resourceImages[fnameSources][source];

        img.onload = function () {
          window.resourceImages[fnameImages][source] = img;
          this.loadedImages++;

          this.context.fillStyle = "rgb(255, 255, 255)";
          this.context.fillRect(0, 0, Dimensions.DIM_X, Dimensions.DIM_Y);

          this.context.font = '36px verdana';
          this.context.fillStyle = "rgb(0, 0, 0)";
          this.context.fillText(
            this.loadedImages + " / " + this.loaderCount + " loaded",
            (Dimensions.DIM_X / 2) - 100, Dimensions.DIM_Y / 2
          );

          if (this.loadedImages == this.loaderCount) {
            setTimeout(this.startGame, 50);
          }
        }.bind(this)
      }.bind(this));
    }.bind(this);

    this.loaderCount =
    Object.keys(window.resourceImages.spriteSources).length +
    Object.keys(window.resourceImages.iconSources).length;

    this.loadedImages = 0;

    loadFolder('spriteSources');
    loadFolder('iconSources');
  },

  handleClick: function (evnt) {
    if (this.nav.handleClick(evnt, this.map) || this.map.handleClick(evnt)) {
      // for now just rerender the map, but we can do better
      this.canvasRender();
    }
  },

  // this is for debugging
  handleHover: function (evnt) {
    // this.map.handleHover(evnt);
  },

  handleKey: function (evnt) {
    switch (evnt.key) {
      case "m":
        this.map.move(this.canvasRender);
        break;
    }
  },

  canvasRender: function () {
    this.map.render(this.context);
    this.nav.render(this.context);
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
      </div>
    );
  }
});

document.addEventListener(
  "DOMContentLoaded",
  function () { ReactDOM.render(< App />, document.getElementById('app')); }
);
