
import { islandAttributes, treasureTrapTypes } from "../appTypes";

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
  'chest',
  'chest',
  'pit',
  'snake',
  'fruit',
  'fruit',
  'nothing',
  'nothing',
  'nothing',
  'nothing',
];
