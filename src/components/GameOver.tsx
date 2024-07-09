import { gameStateTypes } from '../App';

function GameOver(props: {gameState: gameStateTypes, hasArrived: boolean}) {
    const { gameState, hasArrived } = props;
    const message = hasArrived ? "You've arrived!" : "Lost at sea";
    const messageClass = hasArrived ? "win-message" : "loss-message";
  return (
    <>
      <div className={messageClass} style={{display: gameState === 'wonGame' ? 'flex' : 'none'}}>
        <div><b><i>{message}</i></b></div>
      </div>
    </>
  )
};

export default GameOver