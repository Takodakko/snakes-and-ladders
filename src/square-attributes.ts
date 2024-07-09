type squareStyleAttributes = Map<number, [number, number, string, string, number]>

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

export default squareAttributes