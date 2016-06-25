# Gameplay

Play is turn-based. Each turn represents a week.

# Settlements

Players begin with 1 settlement. Settlements have a population, produce gold, and have territory.

Population grows depending on the resources a settlement has access to.

The resources settlements have access to is dependent on the tiles within their territory.

## Claiming tiles

Players can claim tiles on the border of a settlement's control by telling their creatures to spend a certain number of weeks on a tile. The number of weeks it takes to claim a tile depends on distance from the settlement and the settlement's population size.

Settlements have a "sphere of influence" which grows with population. Larger settlements can claim territory faster.

## Conquering / losing tiles

Players can claim other players' tiles. The time to claim others' tiles is increased by a small factor in this case.

## Claiming settlements

To claim a settlement, a player need only occupy the settlement's tile. If the settlement has a garrison, they must defeat it to move on to the tile.

When a player claims a settlement, the previous owner of the settlement loses their previous territory, but the new owner does not immediately gain control of that territory. If the settlement is dependent on the lost tiles' resources, this can trigger population loss.

# Battles

When a creature stack moves onto the same tile as a hostile creature stack, a battle is triggered. Battles take place on a battlefield. Each participating creature has one turn per round, may move according to their speed, and may take one action. 

# Win condition

A player wins when either:
  1. They are the only player left with claimed territory
  2. All territory has been claimed, and they have a plurality of it.
