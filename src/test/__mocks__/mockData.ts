import { dialogTypes } from '../../appTypes';

const mockMessages: Record<dialogTypes, string> = {
    points: 'Collect points from islands. You lose 1 point for each turn. Some islands have traps that make you lose points.',
    move: 'Moving lowers stamina by the number on the die. If your stamina hits 0 before you get to the last tile, you lose!',
    rest: "Resting recovers stamina by half of the value on the die, rounded down. (So you don't recover if the die has 1!) But you still take a turn and lose 1 point.",
    none: "",
  };

  const mockData = {
    mockMessages,
  };

  export default mockData;