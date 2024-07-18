import { dialogTypes, queryMessageType, treasureTrapObject } from '../../appTypes';

const mockMessages: Record<dialogTypes, string> = {
    points: 'Collect points from islands. You lose 1 point for each turn. Some islands have traps that make you lose points.',
    move: 'Moving lowers stamina by the number on the die. If your stamina hits 0 before you get to the last tile, you lose!',
    rest: "Resting recovers stamina by half of the value on the die, rounded down. (So you don't recover if the die has 1!) But you still take a turn and lose 1 point.",
    none: "",
  };

  const mockQueryMessage: queryMessageType = ['query', 0, "Do you wish to explore for -1 stamina? There are sometimes risks, but sometimes rewards..."];

  const mockTreasureTypeDictionary: treasureTrapObject = {
    'chest': ['chest', 20, "There was a chest filled with treasure! Finders keepers, right?"],
    'pit': ['pit', -2, "Apparently someone laid out some traps on this island. Some of your crew fell into a pitfall trap. :("],
    'snake': ['snake', -5, "The island has many venomous snakes. You found that out when almost half your crew got bitten by them."],
    'fruit': ['fruit', 15, "The island is filled with trees growing a delicious fruit! You load your ship up with it."],
    'nothing': ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."],
  };

  const mockData = {
    mockMessages,
    mockQueryMessage,
    mockTreasureTypeDictionary,
  };

  export default mockData;