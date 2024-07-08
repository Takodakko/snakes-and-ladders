import { useMemo } from 'react';
import Square from  './Square';
import imageList from "../imageList";
import './Board.css';
type squareStyleAttributes = Map<number, [number, number, string, string, number]>

function Board(props: {numberOfSquares: number, pieceType: string, playerPosition: number, getSquareData: Function}) {
    const { numberOfSquares, playerPosition, getSquareData } = props;
    function getRandomNumber(num: number) {
      return Math.floor(Math.random() * num);
    };
    
    const pieceType = imageList[props.pieceType];
    const margin = () => getRandomNumber(30);
    const padding = () => getRandomNumber(30);
    const borderWidth = () => getRandomNumber(8);
    const colorList = ['lime', 'green', 'coral', 'chocolate', 'olive', 'burlywood', 'tan', 'sienna', 'darkgreen', 'mediumseagreen'];
    const backgroundColor = () => colorList[getRandomNumber(colorList.length)];

    const radiusPercentsList = [30, 35, 40, 45, 50, 55, 60, 65, 70];
    const radiusPercents = () => `${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% ${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% ${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% ${radiusPercentsList[getRandomNumber(radiusPercentsList.length)]}% `

    const boardState: squareStyleAttributes = useMemo(() => {
      const map: squareStyleAttributes = new Map();
      for (let i = 0; i < numberOfSquares; i++) {
        map.set(i, [margin(), padding(), backgroundColor(), radiusPercents(), borderWidth()]);
      }
      return map;
    }, [numberOfSquares]);
    
    const listOfSquares = useMemo(() => {
      const array: JSX.Element[] = [];
      for (let i = numberOfSquares; i > 0; i--) {
        const styleAttributes = boardState.get(i - 1) ?? [0, 0, 'darkgreen', '50% 50% 50% 50%', 2];
        array.push(<Square styleAttributes={styleAttributes} hasPiece={playerPosition === i} pieceType={pieceType} key={i} tileNumber={(i).toString()}/>);
      }
      getSquareData(array);
      return array;
    }, [numberOfSquares, playerPosition, pieceType])
    
  
    return (
      <>
      <div className="board">
        {listOfSquares}
      </div>
      </>
    )
  }
  
  export default Board