import { useState, useMemo } from 'react';
import Board from './components/Board';
import LoginView from './components/LoginView';
import NewGameSetup from './components/NewGameSetup';
import Die from './components/Die';
import imageList from './imageList';
import './App.css';
type gameStateTypes = 'login' | 'newGame' | 'playingGame' | 'wonGame';

function App() {
  
  const [userName, setUserName] = useState('');

  function changeLogin() {
    startOver();
    setUserName('');
    setGameState('login');
  }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [gameState, setGameState] = useState<gameStateTypes>('login');

  function startOver() {
    setGameState('newGame');
    setCurrentPlayerPosition(1);
    setCanRollDie(true);
  }

  function displayUserName(name: string) {
    setUserName(name);
    setGameState('newGame');
  };


  const [numberOfSquares, setNumberOfSquares] = useState(25);

  function changeNumberOfSquares(num: number) {
    setNumberOfSquares(num);
    setGameState('playingGame');
  };
  

  const [chosenPieceType, setChosenPieceType] = useState('sail');

  function changePieceType(type: string) {
    setChosenPieceType(type);
  };

  const [currentPlayerPosition, setCurrentPlayerPosition] = useState(1);
  const [numberOnDie, setNumberOnDie] = useState(1);
  const [canRollDie, setCanRollDie] = useState(true);

  function rollDie(num: number) {
    setNumberOnDie(num);
    setCanRollDie(false);
  }

  function movePiece(num: number) {
    const nextSpace = currentPlayerPosition + num;
    setCurrentPlayerPosition(nextSpace <= numberOfSquares ? nextSpace : numberOfSquares);
    if (nextSpace >= numberOfSquares) {
      setGameState('wonGame');
    } else {
      setCanRollDie(true);
    }
  };


  const [squareData, setSquareData] = useState<JSX.Element[]>([]);
  function getSquareData(data: JSX.Element[]) {
    setSquareData(data);
  };

  const dataToSave = useMemo(() => {
    const data = {
      numberOnDie,
      canRollDie,
      chosenPieceType,
      currentPlayerPosition,
      numberOfSquares,
      gameState,
      userName,
      squareData,
    };
    return data;
  }, [numberOfSquares, numberOnDie, canRollDie, chosenPieceType, currentPlayerPosition, gameState, userName, squareData]);

  function saveGame() {
    console.log(dataToSave, 'data');
    //send save data to DB
    changeLogin();
  };

  return (
    <>
    <div className="overall-view">
      <div style={{display: gameState === 'login' ? 'block' : 'none'}}>
          <LoginView displayUserName={displayUserName}/>
      </div>
      <div className="board-side" style={{backgroundImage: `url(${imageList.waves})`, display: gameState === 'login' ? 'none' : 'block'}}>
        <div style={{display: gameState === 'newGame' ? 'block' : 'none'}}>
          <NewGameSetup changeNumberOfSquares={changeNumberOfSquares} changePieceType={changePieceType}/>
        </div>
        <div className="card" style={{display: gameState === 'playingGame' || gameState === 'wonGame' ? 'block' : 'none'}}>
          <Board numberOfSquares={numberOfSquares} pieceType={chosenPieceType} playerPosition={currentPlayerPosition} getSquareData={getSquareData}/>
        </div>
      </div>

      <div style={{display: gameState === 'playingGame' || gameState === 'wonGame' ? 'block' : 'none'}}>
        <div style={{position: 'sticky', top: '30px'}} className="side-card">
          <div className="side-item" style={{color: 'black'}}>
            Ships and Islands<br></br>
            Player: <b>{userName}</b>
            <button onClick={() => changeLogin()}>Log out</button><br></br>
            <button onClick={() => saveGame()}>Save current game and log out?</button>
          </div>
          <div className="side-item" style={{margin: '2em'}}>
          <div>
            <Die dots={numberOnDie} rollDie={rollDie} canRollDie={canRollDie}/>
          </div>
          <div>
            <button disabled={gameState === 'wonGame' || canRollDie} onClick={() => movePiece(numberOnDie)}>Move Forward</button>
          </div>
          </div>
          <div className="side-item" style={{margin: '2em'}}>
            <button onClick={() => startOver()}>New Game?</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
