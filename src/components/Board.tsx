import Square from  './Square';
import './Board.css';
import { islandAttributes, islandStyleArray, treasureTrapTypes } from '../appTypes';

/** Creates JSX for board layout */
function Board(props: {numberOfSquares: number, pieceType: string, playerPosition: number, chosenIslandData: islandAttributes}) {
    const { numberOfSquares, playerPosition, chosenIslandData, pieceType } = props;
    
    const defaultMessageType: treasureTrapTypes = 'nothing';

    const listOfSquares = () => {
      const array: JSX.Element[] = [];
      for (let i = numberOfSquares; i > 0; i--) {
        const islandStyleArray: islandStyleArray = chosenIslandData.get(i - 1) ?? [0, 0, 'darkgreen', '50% 50% 50% 50%', 2, defaultMessageType];
        array.push(<Square styleAttributes={islandStyleArray} hasPiece={playerPosition === i} pieceType={pieceType} key={i} tileNumber={(i).toString()}/>);
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