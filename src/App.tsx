import { useState, useMemo, useEffect } from 'react';
import Board from './components/Board';
import LoginView from './components/LoginView';
import NewGameSetup from './components/NewGameSetup';
import Die from './components/Die';
import HighScore from './components/HighScore';
import MessageWindow from './components/MessageWIndow';
import highScoreCalcs from './high-score-arrangements';
import { highScoreListType } from './high-score-arrangements';
import boardDeterminers from './board-characteristics';
import GameOver from './components/GameOver';
import { treasureTrapTypes, treasureTrapMap, squareStyleAttributes } from './board-characteristics';
import imageList from './imageList';
import './App.css';
type gameStateTypes = 'login' | 'newGame' | 'playingGame' | 'wonGame';
type queryMessageType = [treasureTrapTypes | 'query', number, string];

function App() {

  // ------------------- log in and new game related ----------------
  
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
    setCurrentScore(0);
    setShowMessage(false);
    setMessageContent(queryMessage);
  }

  function displayUserName(name: string) {
    setUserName(name);
    setGameState('newGame');
  };

  const newGameButtonClass = gameState === 'wonGame' ? 'new-game-pulse' : '';

// ------------------ Game setup --------------------------
  const [numberOfSquares, setNumberOfSquares] = useState(25);
  const [currentStamina, setCurrentStamina] = useState(1);

  function changeNumberOfSquares(num: number) {
    setNumberOfSquares(num);
    setCurrentStamina(num - 1);
    setGameState('playingGame');
  };
  

  const [chosenPieceType, setChosenPieceType] = useState('sail');

  function changePieceType(type: string) {
    setChosenPieceType(type);
  };

  // --------------------- While playing --------------------------------

  const [currentPlayerPosition, setCurrentPlayerPosition] = useState(1);
  const [numberOnDie, setNumberOnDie] = useState(1);
  const [canRollDie, setCanRollDie] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const queryMessage: queryMessageType = ['query', 0, "Do you wish to explore? There are sometimes risks, but sometimes rewards..."];
  const [messageContent, setMessageContent] = useState<queryMessageType>(queryMessage);

  function rollDie(num: number) {
    setNumberOnDie(num);
    setCanRollDie(false);
    setMessageContent(queryMessage);
  };

  function exploreIsland() {
    setCurrentStamina(currentStamina - 1);
    const currentMessageContent = treasuresAndTrapsData.get(currentPlayerPosition) ?? ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."];
    setMessageContent(currentMessageContent);
    setShowMessage(true);
    addToScore(currentMessageContent[1]);
  };

  function messageWindowClose(onlyClose: boolean) {
    if (onlyClose) {
      setShowMessage(false);
    } else {
      exploreIsland();
    }
  };

  function movePiece(num: number) {
    setCurrentScore(currentScore - num);
    setCurrentStamina(currentStamina - num);
    const nextSpace = currentPlayerPosition + num <= numberOfSquares ? currentPlayerPosition + num : numberOfSquares;
    
      setTimeout(() => {
        setCurrentPlayerPosition(nextSpace);
      }, 200);
    
    if (nextSpace >= numberOfSquares) {
      setGameState('wonGame');
    } else {
      setTimeout(() => {
        setShowMessage(true);
        setCanRollDie(true);
      }, 500);
      
    }
  };

  function rest() {
    const halfOfDie = Math.floor(numberOnDie / 2);
    setCurrentStamina(currentStamina + halfOfDie);
    setCurrentScore(currentScore - 2);
    setCanRollDie(true);
  }

  function addToScore(num: number) {
    setCurrentScore(currentScore + num);
  };

  // --------------------- Data to save state of game -----------------------
  const { squareAttributes, placeTreasuresAndTraps } = boardDeterminers;
  const chosenSquareData = useMemo<squareStyleAttributes>(() => {
    const squares = squareAttributes(numberOfSquares);
    return squares;
  }, [numberOfSquares]); 

  const treasuresAndTrapsData = useMemo<treasureTrapMap>(() => {
    const tAndT = placeTreasuresAndTraps(numberOfSquares);
    return tAndT;
  }, [numberOfSquares]);


  const dataToSave = useMemo(() => {
    const data = {
      numberOnDie,
      canRollDie,
      chosenPieceType,
      currentPlayerPosition,
      numberOfSquares,
      gameState,
      userName,
      chosenSquareData,
      currentScore,
      showMessage,
      messageContent,
      currentStamina,
    };
    return data;
  }, [numberOfSquares, numberOnDie, canRollDie, chosenPieceType, currentPlayerPosition, gameState, userName, chosenSquareData, currentScore, showMessage, messageContent, currentStamina]);

  function saveGame() {
    console.log(dataToSave, 'data');
    //send save data to DB
    changeLogin();
  };

  // --------------------- High Score --------------------
  const { addScore, removeScore } = highScoreCalcs;
  const fakeList: highScoreListType = [[100, 'Claude'], [90, 'Leonie'], [85, 'Lysithea'], [70, 'Lorenz'], [60, 'Ignatz'], [55, 'Raphael'], [10, 'Hilda'], [5, 'Marianne']];
  const [highScores, setHighScores] = useState<highScoreListType>(fakeList);
  addScore(fakeList);
  removeScore(fakeList);
  
  

  return (
    <>
    <div className="message-window-container" style={{display: showMessage ? 'flex' : 'none'}}>
      <MessageWindow content={messageContent} messageWindowClose={messageWindowClose}/>
    </div>
    <div className="overall-view">

      <div style={{display: gameState === 'login' ? 'block' : 'none'}}>
          <LoginView displayUserName={displayUserName}/>
      </div>
      <div className="board-side" style={{backgroundImage: `url(${imageList.waves})`, display: gameState === 'login' ? 'none' : 'block'}}>
        <GameOver gameState={gameState} hasArrived={currentPlayerPosition === numberOfSquares}/>
        <div style={{display: gameState === 'newGame' ? 'block' : 'none'}}>
          <NewGameSetup changeNumberOfSquares={changeNumberOfSquares} changePieceType={changePieceType}/>
        </div>
        <div className="card" style={{display: gameState === 'playingGame' || gameState === 'wonGame' ? 'block' : 'none'}}>
          <Board numberOfSquares={numberOfSquares} pieceType={chosenPieceType} playerPosition={currentPlayerPosition} chosenSquareData={chosenSquareData}/>
        </div>
      </div>

      <div style={{display: gameState === 'playingGame' || gameState === 'wonGame' ? 'block' : 'none'}}>
        <div style={{position: 'sticky', top: '30px'}} className="side-card">
          <div className="side-item" style={{color: 'black'}}>
            Ships and Islands<br></br>
            <div>Player: <b>{userName}</b></div>
            <div>Points: <b>{currentScore}</b></div>
            <div>Stamina: <b>{currentStamina}</b></div>
            <button onClick={() => changeLogin()}>Log out</button><br></br>
            <button disabled={gameState === 'wonGame'} onClick={() => saveGame()}>Save current game and log out?</button>
          </div>
          <div className="side-item" style={{margin: '2em'}}>
          <div>
            <Die dots={numberOnDie} rollDie={rollDie} canRollDie={canRollDie && !showMessage}/>
          </div>
          <div>
            <button disabled={gameState === 'wonGame' || canRollDie || showMessage} onClick={() => movePiece(numberOnDie)}>Move Forward for - {numberOnDie}</button><br></br>
            <button disabled={gameState === 'wonGame' || canRollDie || showMessage} onClick={() => rest()}>Rest and recover</button>
          </div>
          </div>
          <div className="side-item" style={{margin: '2em'}}>
            <button className={newGameButtonClass} onClick={() => startOver()}>New Game?</button>
          </div>
        </div>
      </div>

    </div>
    </>
  )
}

export default App
export type { queryMessageType, gameStateTypes }
