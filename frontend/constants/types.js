var constants = {

  all: [
    'grass',
    'water',
    'snow',
    'plains',
    'tundra',
    'forest',
    'swamp',
    'desert'
  ],

  starting: [
    'grass', 'plains', 'forest'
  ],

  interior: [
    'water', 'snow', 'tundra', 'swamp', 'desert'
  ],

  colors: {
    grass: "rgb(114, 220, 90)",
    forest: "rgb(59, 115, 52)",
    swamp: "rgb(129, 187, 111)",
    water: "rgb(90, 114, 220)",
    snow: "rgb(195, 243, 247)",
    plains: "rgb(180, 130, 50)",
    tundra: "rgb(106, 85, 117)",
    desert: "rgb(247, 234, 143)",
    mountain: 'black'
  },

  creatures: [
    'water',
    'earth',
    'fire',
    'magic',
    'plant',
    'air',
    'storm'
  ],

  occurrenceRates: {
    water: {
      water: 0,
      earth: 0,
      fire: 0,
      magic: 0,
      plant: 0,
      air: 0,
      storm: 0
    },

    grass: {
      water: .3,
      earth: .3,
      fire: .1,
      magic: .02,
      plant: .2,
      air: .04,
      storm: .04
    },

    snow: {
      water: .5,
      earth: .05,
      fire: .01,
      magic: .1,
      plant: .01,
      air: .3,
      storm: .03
    },

    plains: {
      water: .05,
      earth: .3,
      fire: .4,
      magic: .02,
      plant: .15,
      air: .03,
      storm: .05
    },

    tundra: {
      water: .01,
      earth: .3,
      fire: .01,
      magic: .2,
      plant: .01,
      air: .3,
      storm: .17
    },

    forest: {
      water: .2,
      earth: .2,
      fire: .03,
      magic: .05,
      plant: .5,
      air: .01,
      storm: .01
    },

    swamp: {
      water: .5,
      earth: .2,
      fire: .01,
      magic: .01,
      plant: .26,
      air: .01,
      storm: .01
    },

    desert: {
      water: .01,
      earth: .05,
      fire: .5,
      magic: .2,
      plant: .01,
      air: .03,
      storm: .2
    }
  }

};

/*function tileSum(tile) {
  var rates = constants.occurrenceRates[tile];
  var sum = Object.keys(rates).reduce(
    function (sum, type) {
      return sum + rates[type];
    }, 0
  );
  // console.log(sum);
  return sum;
}

constants.all.forEach(function (tileType) {
  var sum = tileSum(tileType);
  console.log(`${tileType}: ${sum}`);
})*/

module.exports = constants;
