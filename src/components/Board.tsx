import Square from  './Square';
import imageList from "../imageList";
import './Board.css';
import { squareStyleAttributes } from '../appTypes';

/** Creates JSX for board layout */
function Board(props: {numberOfSquares: number, pieceType: string, playerPosition: number, chosenSquareData: squareStyleAttributes}) {
    const { numberOfSquares, playerPosition, chosenSquareData } = props;
    
    const pieceType = imageList[props.pieceType];
    
    const listOfSquares = () => {
      const array: JSX.Element[] = [];
      for (let i = numberOfSquares; i > 0; i--) {
        const styleAttributes = chosenSquareData.get(i - 1) ?? [0, 0, 'darkgreen', '50% 50% 50% 50%', 2];
        array.push(<Square styleAttributes={styleAttributes} hasPiece={playerPosition === i} pieceType={pieceType} key={i} tileNumber={(i).toString()}/>);
      }
      return array;
    };
    
  
    return (
      <>
      <div className="board">
        {listOfSquares()}
      </div>
      </>
    )
  }
  
  export default Board