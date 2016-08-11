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

  physical: [
    'beast',
    'bird',
    'humanoid',
    'energy'
  ],

  statBoosts: {
    water: {constitution: 1, speed: 1},
    earth: {constitution: 2, strength: 1},
    fire: {dexterity: 2, speed: 1},
    magic: {intelligence: 3},
    plant: {constitution: 2},
    air: {dexterity: 2, speed: 2},
    storm: {speed: 3, dexterity: 3},
    beast: {strength: 2, constitution: 1},
    bird: {speed: 1, dexterity: 1},
    humanoid: {intelligence: 2, dexterity: 1},
    energy: {intelligence: 1}
  },

  resources: {
    water: {
      food: 2,
      gold: 0,
      ore: 0,
      wood: 0,
      salt: 2
    },
    grass: {
      food: 2,
      gold: 2,
      ore: 1,
      wood: 1,
      salt: 0
    },
    plains: {
      food: 3,
      gold: 2,
      ore: 0,
      wood: 1,
      salt: 0
    },
    tundra: {
      food: 1,
      gold: 1,
      ore: 1,
      wood: 0,
      salt: 1
    },
    snow: {
      food: 0,
      gold: 1,
      ore: 1,
      wood: 1,
      salt: 2
    },
    forest: {
      food: 1,
      gold: 2,
      ore: 1,
      wood: 3,
      salt: 0
    },
    swamp: {
      food: 1,
      gold: 1,
      ore: 0,
      wood: 2,
      salt: 1
    },
    jungle: {
      food: 2,
      gold: 1,
      ore: 0,
      wood: 2,
      salt: 0
    },
    desert: {
      food: 0,
      gold: 3,
      ore: 1,
      wood: 0,
      salt: 3
    }
  },

  occurrenceRates: { // all should add up to 30 (except water)
    water: {
      water: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      },
      earth: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      },
      fire: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      },
      magic: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      },
      plant: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      },
      air: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      },
      storm: {
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: 0
      }
    },

    grass: { // 30
      water: { // 7.5
        beast: 3,
        bird: 3,
        humanoid: .5,
        energy: 1
      },

      earth: { // 8.1
        beast: 4.1,
        bird: 2,
        humanoid: 1.5,
        energy: 1.5
      },

      fire: { // 2.2
        beast: .1,
        bird: 1,
        humanoid: .1,
        energy: 1
      },

      magic: { // 1.3
        beast: .1,
        bird: .1,
        humanoid: .1,
        energy: 1
      },

      plant: { // 4.2
        beast: 2,
        bird: .5,
        humanoid: 2,
        energy: .3
      },

      air: { // 2.1
        beast: .5,
        bird: 1,
        humanoid: .1,
        energy: 1
      },

      storm: { // 1.6
        beast: .5,
        bird: 1,
        humanoid: .5,
        energy: .5
      }
    },

    snow: { // 30
      water: { // 15
        beast: 4,
        bird: 4,
        humanoid: 3,
        energy: 4
      },

      earth: { // 2.1
        beast: 1,
        bird: .5,
        humanoid: .5,
        energy: .1
      },

      fire: { // .1
        beast: 0,
        bird: 0,
        humanoid: 0,
        energy: .1
      },

      magic: { // 3.5
        beast: 1,
        bird: 1,
        humanoid: .5,
        energy: 1
      },

      plant: { // 1.7
        beast: 1,
        bird: .1,
        humanoid: .5,
        energy: .1
      },

      air: { // 6
        beast: 1,
        bird: 2,
        humanoid: 2,
        energy: 1
      },

      storm: { // 1.6
        beast: .1,
        bird: .5,
        humanoid: .5,
        energy: .5
      }
    },

    plains: { // 29.4
      water: { // 1.6
        beast: .5,
        bird: .5,
        humanoid: .5,
        energy: .1
      },

      earth: { // 8
        beast: 3,
        bird: 1,
        humanoid: 2,
        energy: 2
      },

      fire: { // 10
        beast: 2,
        bird: 2,
        humanoid: 2,
        energy: 4
      },

      magic: { // 2
        beast: .5,
        bird: .5,
        humanoid: .5,
        energy: .5
      },

      plant: { // 2.6
        beast: .5,
        bird: .1,
        humanoid: 1,
        energy: 1
      },

      air: { // 3.6
        beast: .1,
        bird: 2,
        humanoid: 1,
        energy: .5
      },

      storm: { // 2.1
        beast: .2,
        bird: .5,
        humanoid: .5,
        energy: 1
      }
    },

    tundra: {
      water: {
        beast: .1,
        bird: .1,
        humanoid: .1,
        energy: .1
      },

      earth: {
        beast: 3,
        bird: 2,
        humanoid: 2,
        energy: 2
      },

      fire: {
        beast: .1,
        bird: .1,
        humanoid: .1,
        energy: .1
      },

      magic: {
        beast: .5,
        bird: .5,
        humanoid: 1,
        energy: 1
      },

      plant: {
        beast: .5,
        bird: .1,
        humanoid: .5,
        energy: .1
      },

      air: {
        beast: 2,
        bird: 4,
        humanoid: .5,
        energy: 2
      },

      storm: {
        beast: .5,
        bird: 2,
        humanoid: 2,
        energy: 3
      }
    },

    forest: {
      water: {
        beast: .5,
        bird: 2,
        humanoid: .5,
        energy: 1
      },

      earth: {
        beast: 3,
        bird: .5,
        humanoid: 2,
        energy: 1
      },

      fire: {
        beast: .1,
        bird: 1,
        humanoid: .1,
        energy: .1
      },

      magic: {
        beast: .5,
        bird: .5,
        humanoid: .5,
        energy: .5
      },

      plant: {
        beast: 4,
        bird: .5,
        humanoid: 3,
        energy: 2
      },

      air: {
        beast: 1,
        bird: 3,
        humanoid: .5,
        energy: .5
      },

      storm: {
        beast: .1,
        bird: 1,
        humanoid: .1,
        energy: .5
      }
    },

    swamp: {
      water: {
        beast: 3,
        bird: 2,
        humanoid: 3,
        energy: 2
      },

      earth: {
        beast: 1,
        bird: .5,
        humanoid: 2,
        energy: 1
      },

      fire: {
        beast: .2,
        bird: .1,
        humanoid: 1,
        energy: 1
      },

      magic: {
        beast: .5,
        bird: .1,
        humanoid: .5,
        energy: .5
      },

      plant: {
        beast: 3,
        bird: 3,
        humanoid: 3,
        energy: 1
      },

      air: {
        beast: .1,
        bird: .5,
        humanoid: .1,
        energy: .1
      },

      storm: {
        beast: .1,
        bird: .5,
        humanoid: .1,
        energy: .1
      }
    },

    desert: {
      water: {
        beast: .1,
        bird: .1,
        humanoid: .1,
        energy: .1
      },

      earth: {
        beast: 2,
        bird: .1,
        humanoid: .5,
        energy: 1
      },

      fire: {
        beast: 4,
        bird: 4,
        humanoid: 2,
        energy: 3
      },

      magic: {
        beast: .1,
        bird: .5,
        humanoid: .5,
        energy: 1
      },

      plant: {
        beast: .1,
        bird: .1,
        humanoid: .1,
        energy: .1
      },

      air: {
        beast: 1,
        bird: 2,
        humanoid: .5,
        energy: 1
      },

      storm: {
        beast: 1,
        bird: 2,
        humanoid: 2,
        energy: 1
      }
    }
  }

};

function tileSum(tile) {
  var rates = constants.occurrenceRates[tile];
  var sum = Object.keys(rates).reduce(
    function (sum, etype) {
      var eRates = rates[etype];
      var eRatesSum = Object.keys(eRates).reduce(function (sum, ptype) {
        return sum + eRates[ptype];
      }, 0);
      return sum + eRatesSum;
    }, 0
  );
  // console.log(sum);
  return sum;
}

// constants.all.forEach(function (tileType) {
//   var sum = tileSum(tileType);
//   console.log(`${tileType}: ${sum}`);
// });

module.exports = constants;
