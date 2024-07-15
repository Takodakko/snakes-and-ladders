
import { squareStyleAttributes, treasureTypeArray, treasureTrapMap } from "../appTypes";

/** Calculates appearance determining attributes for randomly generated board */
function squareAttributes(numberOfSquares: number) {
    function getRandomNumber(num: number) {
        return Math.floor(Math.random() * num);
      };
    const margin = () => getRandomNumber(30);
    const padding = () => getRandomNumber(30);
    const borderWidth = () => getRandomNumber(8);
    const colorList = ['lime', 'green', 'coral', 'chocolate', 'olive', 'burlywood', 'tan', 'sienna', 'darkgreen', 'mediumseagreen'];
    const backgroundColor = () => colorList[getRandomNumber(colorList.length)];
  
    const radiusPercentsList = [30, 35, 40, 45, 50, 55, 60, 65, 70];
    const radiusPercents = () => `${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% ${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% ${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% ${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% `;
    const map: squareStyleAttributes = new Map();
      for (let i = 0; i < numberOfSquares; i++) {
        map.set(i, [margin(), padding(), backgroundColor(), radiusPercents(), borderWidth()]);
      }
    return map;
};

const treasureTrapDetails: treasureTypeArray = [
  ['chest', 20, "There was a chest filled with treasure! Finders keepers, right?"],
  ['chest', 20, "There was a chest filled with treasure! Finders keepers, right?"],
  ['pit', -2, "Apparently someone laid out some traps on this island. Some of your crew fell into a pitfall trap. :("],
  ['snake', -5, "The island has many venomous snakes. You found that out when almost half your crew got bitten by them."],
  ['fruit', 15, "The island is filled with trees growing a delicious fruit! You load your ship up with it."],
  ['fruit', 15, "The island is filled with trees growing a delicious fruit! You load your ship up with it."],
  ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."],
  ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."],
  ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."],
  ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."]
];

/** Calculates where treasures and traps will appear. Should merge with square attribute map creator */
function placeTreasuresAndTraps(num: number) {
  const newMap: treasureTrapMap = new Map();
  for (let i = 1; i < num + 1; i++) {
    const randomChoice = treasureTrapDetails[Math.floor(Math.random() * treasureTrapDetails.length)];
    newMap.set(i, randomChoice);
  }
  return newMap;
};



const boardDeterminers = {
  squareAttributes,
  placeTreasuresAndTraps,
};

export default boardDeterminers