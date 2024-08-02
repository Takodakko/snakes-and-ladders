
import { islandAttributes, treasureTrapTypes, treasureTrapObject } from "../appTypes";

/** Calculates appearance determining attributes for randomly generated board */
export function decideIslandAttributes(numberOfSquares: number) {
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
    const randomTreasureChoices = (): treasureTrapTypes => treasureTrapDetails[Math.floor(Math.random() * treasureTrapDetails.length)];
    const map: islandAttributes = new Map();
      for (let i = 0; i < numberOfSquares; i++) {
        map.set(i, [margin(), padding(), backgroundColor(), radiusPercents(), borderWidth(), randomTreasureChoices()]);
      }
    return map;
};

const treasureTrapDetails: treasureTrapTypes[] = [
  // 'chest',
  // 'chest',
  // 'pit',
  // 'snake',
  // 'fruit',
  // 'fruit',
  // 'nothing',
  // 'nothing',
  // 'nothing',
  // 'nothing',
  'enemy',
];

export const treasureTypeDictionary: treasureTrapObject = {
  'chest': ['chest', 20, "There was a chest filled with treasure! Finders keepers, right?"],
  'pit': ['pit', -2, "Apparently someone laid out some traps on this island. Some of your crew fell into a pitfall trap. :("],
  'snake': ['snake', -5, "The island has many venomous snakes. You found that out when almost half your crew got bitten by them."],
  'fruit': ['fruit', 15, "The island is filled with trees growing a delicious fruit! You load your ship up with it."],
  'nothing': ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."],
  'enemy': ['enemy', 0, "The island was inhabited by pirates!"],
};
