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

  capitalize: function (str) {
    if (!str) return str;
    if (str.length === 1) return str.toUpperCase();

    var capital = str[0].toUpperCase();
    var rest = str.substr(1);
    return `${capital}${rest}`;
  },

  randInRange: function (min, max, floatFlag) {
    var difference = Math.abs(max - min);
    var randFloatOffset = Math.random() * difference;
    var randOffset = floatFlag ? randFloatOffset : Math.floor(randFloatOffset);
    return randOffset + min;
  },

  distance: function (p1, p2) {
    var xDiff = p1[0] - p2[0];
    var yDiff = p1[1] - p2[1];

    var xSquare = xDiff * xDiff;
    var ySquare = yDiff * yDiff;

    return Math.sqrt(xSquare + ySquare);
  },

  pushAll: function (array, toAdd) {
    toAdd.forEach(function (el) {
      array.push(el);
    });
  },

  weightedRandomChoice: function (array, weights, total) {
    var weights_total = total || weights.reduce(function (acc, w) {
      return acc + w;
    }, 0);

    var num = HelperUtil.randInRange(0, weights_total, true);
    // console.log(`chose ${num} (max ${weights_total})`);
    var prev = 0;

    for (i = 0; i < array.length; i++) {
      var el = array[i];
      if (HelperUtil.between(num, prev, weights[i])) {
        return el;
      }

      prev = weights[i];
    }

    return null;
  },

  rawWeightedRandomChoice: function (array, rawWeights) {
    var runningSum = 0;
    var weights = rawWeights.map(function (rw) {
      runningSum += rw;
      return runningSum;
    });
    return HelperUtil.weightedRandomChoice(array, weights, runningSum);
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
