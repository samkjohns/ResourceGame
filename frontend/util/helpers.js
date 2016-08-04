var types = require('../constants/types.js');

var HelperUtil = module.exports = {
  objectUnion: function (ob1, ob2) {
    output = {};

    // duplicate ob1
    Object.keys(ob1).forEach(function (key) {
      output[key] = ob1[key];
    });

    // merge with ob2
    Object.keys(ob2).forEach(function (key) {
      output[key] = ob2[key];
    });

    return output;
  },

  objectMerge: function (ob1, ob2) {
    Object.keys(ob2).forEach(function (key) {
      ob1[key] = ob2[key];
    });
  },

  debug_log: function (flag, message) {
    if (flag) console.log(message);
  },

  // min is inclusive, max is exclusive
  between: function (val, min, max) {
    return val >= min && val < max;
  },

  randInRange: function (min, max) {
    var difference = Math.abs(max - min);
    var randOffset = Math.floor(Math.random() * difference);
    return randOffset + min;
  },

  // gradient for testing
  // make sure to bind self.animating (or false)
  getGradient: function (animating, ctx, hex, row, col, maxRow, maxCol) {
    // if (hex.discovered) {
      if (hex.inPath && !animating) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.strokeStyle = ctx.fillStyle;

      } else {
        var opacity = (row / maxRow);
        var blue = Math.floor(255 * (col / maxCol));
        var color = `rgba(114, 220, ${blue}, ${opacity})`;
        var stroke = `rgba(114, 220, ${blue}, 1)`;
        ctx.fillStyle = color;
        ctx.strokeStyle = stroke;
      }

    // } else {
    //   ctx.fillStyle = 'black';
    //   ctx.strokeStyle = 'black';
    // }
  },

  getFillType: function (animating, ctx, hex) {
    if (hex.discovered) {
      var style = (hex.inPath && !animating) ?
        "rgba(255, 0, 0, .5)" : types.colors[hex.type];
      ctx.fillStyle = style;

    } else {
      ctx.fillStyle = 'black';
    }

    // ctx.strokeStyle = ctx.fillStyle;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
  },

  getShowAll: function (animating, ctx, hex) {
    var style = (hex.inPath && !animating) ?
      "rgba(255, 0, 0, .5)" : types.colors[hex.type];
    ctx.fillStyle = style;
    // ctx.strokeStyle = ctx.fillStyle;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
  }
};
