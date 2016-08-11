# Resources

 * Food: essential for population growth
 * Gold: essential for purchasing various things
 * Ore: building construction
 * Wood: building construction
 * Salt: boost to pop. growth, boost to gold prod.

## Tile outputs

| Tile   | Food | Gold | Ore | Wood | Salt |
| ------ | ---- | ---- | --- | ---- | ---- |
| Grass  | M    | M    | L   | L    | 0    |
| Plains | H    | M    | 0   | L    | 0    |
| Tundra | L    | L    | L   | M    | L    |
| Snow   | 0    | L    | L   | L    | M    |
| Forest | L    | M    | 0   | H    | 0    |
| Swamp  | L    | L    | 0   | M    | L    |
| Jungle | M    | L    | 0   | M    | 0    |
| Desert | 0    | H    | L   | 0    | H    |
| Water  | M    | 0    | 0   | 0    | M    |

## Type dependencies

All types require Food.

| Type      | Requirements    |
| --------- | --------------- |
| Water     | Salt            |
| Earth     | Ore             |
| Fire      | Ore, Wood       |
| Magic     | Salt, Gold      |
| Plant     | Wood            |
| Air       | Ore, Wood, Gold |
| Storm     | Gold            |

## Mines

Certain tiles have mines, meaning they produce extra amounts of a given resource. (+high)

Mine types:
 * Ore
 * Gold
 * Salt
