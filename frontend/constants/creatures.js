module.exports = {

  // Beasts
  gorgon: {
    // while an individual creature has one physical type,
    // some species might be one of several types
    // elemental types have values, which represent the minimum
    // value a creature must have to be a given creature
    types: {
      physical: ['beast'],
      elemental: { fire: .3 }
    },
    ability: 'fire breath',
    size: 1
  },

  unicorn: {
    types: {
      physical: ['beast'],
      elemental: { magic: .1 }
    },
    ability: 'aura of protection',
    size: 1
  },

  'tyrannosaurus rex': {
    types: {
      physical: ['beast'],
      elemental: null
    },
    ability: 'charge',
    size: 2
  },

  stegosaurus: {
    types: {
      physical: ['beast'],
      elemental: null
    },
    ability: 'charge',
    size: 2
  },

  centaur: {
    types: {
      physical: ['beast', 'humanoid'],
      elemental: null
    },
    ability: 'wield',
    size: 1
  },

  worm: {
    types: {
      physical: ['beast'],
      elemental: { earth: .3 }
    },
    ability: 'burrow',
    size: 3
  },

  hydra: {
    types: {
      physical: ['beast'],
      elemental: null
    },
    ability: 'regeneration',
    size: 2
  },

  minotaur: {
    types: {
      physical: ['beast', 'humanoid'],
      elemental: null
    },
    ability: 'wield',
    size: 1
  },

  basilisk: {
    types: {
      physical: ['beast'],
      elemental: { magic: .2 }
    },
    ability: 'petrifying gaze',
    size: 2
  },

  'dragon-turtle': {
    types: {
      physical: ['beast'],
      elemental: { water: .2, fire: .1 }
    },
    ability: 'steam breath',
    size: 3
  },

  // Birds
  roc: {
    types: {
      physical: ['bird'],
      elemental: null
    },
    ability: 'carry',
    size: 3
  },

  dragon: {
    types: {
      physical: ['bird'],
      elemental: { fire: .5 }
    },
    ability: 'fire breath',
    size: 3
  },

  pterodactyl: {
    types: {
      physical: ['bird'],
      elemental: null
    },
    ability: 'carry',
    size: 2
  },

  wyvern: {
    types: {
      physical: ['bird'],
      elemental: null
    },
    ability: 'poison sting',
    size: 2
  },

  griffon: {
    types: {
      physical: ['bird', 'beast'],
      elemental: { air: .1 }
    },
    ability: 'carry',
    size: 2
  },

  manticore: {
    types: {
      physical: ['bird', 'beast'],
      elemental: { magic: .1 }
    },
    ability: 'poison sting',
    size: 1
  },

  phoenix: {
    types: {
      physical: ['bird'],
      elemental: { fire: .5 }
    },
    ability: 'rebirth',
    size: 3
  },

  peryton: {
    types: {
      physical: ['bird'],
      elemental: { air: .1, magic: .2 }
    },
    ability: 'blood sense',
    size: 1
  },

  pegasus: {
    types: {
      physical: ['bird', 'beast'],
      elemental: { plant: .1, magic: .1 }
    },
    ability: 'charge',
    size: 1
  },

  harpy: {
    types: {
      physical: ['humanoid', 'bird'],
      elemental: null
    },
    ability: 'charm',
    size: 1
  },

  gargoyle: {
    types: {
      physical: ['humanoid', 'bird'],
      elemental: { earth: .4 }
    },
    ability: 'camouflage',
    size: 1
  },

  drake: {
    types: {
      physical: ['bird'],
      elemental: null
    },
    ability: 'fire breath',
    size: 1
  },

  // Humanoids
  goblin: {
    types: {
      physical: ['humanoid'],
      elemental: null
    },
    ability: 'wield',
    size: 1
  },

  medusa: {
    types: {
      physical: ['humanoid'],
      elemental: { earth: .1 }
    },
    ability: 'petrifying gaze',
    size: 1
  },

  naga: {
    types: {
      physical: ['humanoid'],
      elemental: null
    },
    ability: 'wield',
    size: 1
  },

  mer: {
    types: {
      physical: ['humanoid'],
      elemental: { water: .3 }
    },
    ability: 'wield',
    size: 1
  },

  pixie: {
    types: {
      physical: ['humanoid'],
      elemental: { plant: .1, magic: .1 }
    },
    ability: 'charm',
    size: 1
  },

  troll: {
    types: {
      physical: ['humanoid'],
      elemental: null
    },
    ability: 'regeneration',
    size: 2
  },

  giant: {
    types: {
      physical: ['humanoid'],
      elemental: null
    },
    ability: 'wield',
    size: 3
  },

  imp: {
    types: {
      physical: ['humanoid'],
      elemental: { fire: .1 }
    },
    ability: 'vanish',
    size: 1
  },

  angel: {
    types: {
      physical: ['humanoid'],
      elemental: { storm: .2 }
    },
    ability: 'wield',
    size: 1
  },

  // Energy
  spirit: {
    types: {
      physical: ['energy'],
      elemental: null
    },
    ability: 'possession',
    size: 1
  },

  wisp: {
    types: {
      physical: ['energy'],
      elemental: { plant: .1 }
    },
    ability: 'confusion',
    size: 1
  },

  ooze: {
    types: {
      physical: ['energy'],
      elemental: { water: .3 }
    },
    ability: 'corrode',
    size: 2
  },

  golem: {
    types: {
      physical: ['energy', 'humanoid'],
      elemental: { earth: .3 }
    },
    ability: 'wield',
    size: 2
  },

  elemental: {
    types: {
      physical: ['energy'],
      elemental: null
    },
    ability: 'teleport',
    size: 1
  },

  dryad: {
    types: {
      physical: ['energy', 'humanoid'],
      elemental: { plant: .4 }
    },
    ability: 'charm',
    size: 1
  }
};
