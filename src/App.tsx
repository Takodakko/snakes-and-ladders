import { useState, useMemo, useCallback, useEffect } from 'react';
import Board from './components/Board';
import LoginView from './components/LoginView';
import NewGameSetup from './components/NewGameSetup';
import Die from './components/Die';
import HighScore from './components/HighScore';
import InfoDialog from './components/InfoDialog';
import MessageWindow from './components/MessageWIndow';
import boardDeterminers from './board-characteristics';
import GameOver from './components/GameOver';
import imageList from './imageList';
import './App.css';

import { treasureTrapTypes, treasureTrapMap, squareStyleAttributes } from './board-characteristics';
type highScoreListType = Array<[number, string]>;
type gameStateTypes = 'login' | 'newGame' | 'playingGame' | 'wonGame';
type dialogTypes = 'rest' | 'move' | 'points' | 'none';
type queryMessageType = [treasureTrapTypes | 'query', number, string];
interface IgameSaveData {
    numberOnDie: number;
    canRollDie: boolean;
    chosenPieceType: string;
    currentPlayerPosition: number;
    numberOfSquares: number;
    gameState: gameStateTypes;
    userName: string;
    chosenSquareData: squareStyleAttributes;
    currentScore: number;
    showMessage: boolean;
    messageContent: queryMessageType;
    currentStamina: number;
    treasuresAndTrapsData: treasureTrapMap;
};

function App() {

  // ------------------- log in and new game related ----------------
  
  const [userName, setUserName] = useState('');

  function changeLogin() {
    startOver();
    setUserName('');
    setGameState('login');
    setIsLoggedIn(false)
  }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function userIsRegistered(yes: boolean) {
    setIsLoggedIn(yes);
  };

  const [gameState, setGameState] = useState<gameStateTypes>('login');

  function startOver() {
    setGameState('newGame');
    setCurrentPlayerPosition(1);
    setCanRollDie(true);
    setCurrentScore(0);
    setShowMessage(false);
    setMessageContent(queryMessage);
    setCurrentStamina(1);
    setShowHighScores(false);
    setNewScoreIndex(-1);
  }

  function displayUserName(name: string, hasSetup: boolean) {
    setUserName(name);
    setGameState(hasSetup ? 'newGame' : 'playingGame');
  };

  const newGameButtonClass = gameState === 'wonGame' ? 'new-game-pulse' : '';

// ------------------ Game setup --------------------------
  const [numberOfSquares, setNumberOfSquares] = useState(25);
  const [currentStamina, setCurrentStamina] = useState(1);

  function changeNumberOfSquares(num: number, stamina: number, points: number) {
    setNumberOfSquares(num);
    setCurrentStamina(stamina);
    setCurrentScore(points);
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
  const queryMessage: queryMessageType = ['query', 0, "Do you wish to explore for -1 stamina? There are sometimes risks, but sometimes rewards..."];
  const [messageContent, setMessageContent] = useState<queryMessageType>(queryMessage);

  function rollDie(num: number) {
    setNumberOnDie(num);
    setCanRollDie(false);
    setMessageContent(queryMessage);
  };

  function exploreIsland() {
    const newStamina = currentStamina - 1;
    setCurrentStamina(currentStamina - 1);
    const currentMessageContent = treasuresAndTrapsData.get(currentPlayerPosition) ?? ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."];
    setMessageContent(currentMessageContent);
    setShowMessage(true);
    addToScore(currentMessageContent[1]);
    if (newStamina <= 0) {
      setGameState('wonGame');
      setShowMessage(false);
    }
  };

  function messageWindowClose(onlyClose: boolean) {
    if (onlyClose) {
      setShowMessage(false);
    } else {
      exploreIsland();
    }
  };

  function movePiece(num: number) {
    setCurrentScore(currentScore - 1);
    const newStamina = currentStamina - num;
    setCurrentStamina(currentStamina - num);
    
    const nextSpace = currentPlayerPosition + num <= numberOfSquares ? currentPlayerPosition + num : numberOfSquares;
    
      setTimeout(() => {
        setCurrentPlayerPosition(nextSpace);
      }, 200);
    
    if (nextSpace >= numberOfSquares) {
      setGameState('wonGame');
      checkList(highScores, [currentScore, userName]);
      setTimeout(() => {
        setShowHighScores(true);
      }, 3000);
    } else {
      if (newStamina <= 0) {
        setGameState('wonGame');
        setShowMessage(false);
        return;
      }
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
  };

  function addToScore(num: number) {
    setCurrentScore(currentScore + num);
  };

  const pointStaminaTextColor = useCallback((num: number) => {
    if (num > 10) {
      return 'black';
    } else if (num > 3 && num <= 10) {
      return 'purple';
    } else {
      return 'red';
    }
  }, [currentScore, currentStamina]);

  const [hover, setHover] = useState<dialogTypes>('none');

  function handleHover(dialogType: dialogTypes = 'none') {
    setHover(dialogType);
  }

  // --------------------- Data to save state of game -----------------------
  const { squareAttributes, placeTreasuresAndTraps, mapToObject, ObjectToMap } = boardDeterminers;
  const [chosenSquareData, setChosenSquareData] = useState<squareStyleAttributes>(squareAttributes(2));
  const [treasuresAndTrapsData, setTreasuresAndTrapsData] = useState<treasureTrapMap>(placeTreasuresAndTraps(2));
  
  function makeSquares(num: number, data?: squareStyleAttributes) {
    const squares = data ? data : squareAttributes(num);
    setChosenSquareData(squares);
  };

  function makeTreasure(num: number, data?: treasureTrapMap) {
    const treasure = data ? data : placeTreasuresAndTraps(num);
    setTreasuresAndTrapsData(treasure);
  };


  const dataToSave: IgameSaveData = useMemo(() => {
    console.log('saving...')
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
      treasuresAndTrapsData,
    };
    return data;
  }, [numberOnDie]);

  async function saveGame() {
      const treasureMap = mapToObject(dataToSave.treasuresAndTrapsData);
      const islandMap = mapToObject(dataToSave.chosenSquareData);
      const body = JSON.stringify({name: userName, game: {...dataToSave, chosenSquareData: islandMap, treasuresAndTrapsData: treasureMap}});
      const request = new Request('/api/users/saveGame', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} });
      const success = await fetch(request)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((e) => console.error(e));
      if (success === 'game saved') {
        changeLogin();
      } else {
        window.alert('There was an issue saving. Try again.');
      }
  };

  function restoreGame(data: Record<string, any>) {
    const { numberOnDie, canRollDie, chosenPieceType, currentPlayerPosition, numberOfSquares, gameState, userName, chosenSquareData, currentScore, showMessage, messageContent, currentStamina, treasuresAndTrapsData } = data;
    const mapifiedTreasure = ObjectToMap(treasuresAndTrapsData);
    const mapifiedIslands = ObjectToMap(chosenSquareData);
    console.log(chosenSquareData);
    setNumberOnDie(numberOnDie);
    setCanRollDie(canRollDie);
    setChosenPieceType(chosenPieceType);
    setCurrentPlayerPosition(currentPlayerPosition);
    setNumberOfSquares(numberOfSquares);
    setGameState(gameState);
    setUserName(userName);
    setCurrentScore(currentScore);
    setShowMessage(showMessage);
    setMessageContent(messageContent);
    setCurrentStamina(currentStamina);
    makeSquares(numberOfSquares, mapifiedIslands);
    makeTreasure(numberOfSquares, mapifiedTreasure)
  };

  // --------------------- High Score --------------------
  
  const fakeList: highScoreListType = [[100, 'Edelgard'], [90, 'Hubert'], [85, 'Linhardt'], [70, 'Ferdinand'], [60, 'Dorothea'], [55, 'Petra'], [10, 'Bernadetta'], [-10, 'Caspar']];
  const [highScores, setHighScores] = useState<highScoreListType>(fakeList); // useEffect get list or use fake if failure
  const [showHighScores, setShowHighScores] = useState(false);
  const [newScoreIndex, setNewScoreIndex] = useState(-1);

  useEffect(() => {
    async function fetchData() {
    await fetch('/api/highScores', {method: 'GET'})
    .then((res) => {
      const data = res.json();
      return data;
    })
    .then((jdata) => {
      if (!jdata || !Array.isArray(jdata)) {
        throw new Error('no data gotten');
      }
      setHighScores(jdata);
    })
    .catch((e) => {
      console.log(e, 'error');
      
    })}
    fetchData();
  }, [showHighScores]);

  function checkList(list: highScoreListType, newEntry: [number, string]) {
    if (!isLoggedIn) return;
    const index = list.findIndex((el) => {
      if (el[0] > newEntry[0]) {
        return false;
      } else {
        return true;
      }
    });
    if (index !== -1) {
      setNewScoreIndex(index);
      addScore(list, newEntry, index);
    }
  };

  async function addListToDB(list: highScoreListType) {
    if (!isLoggedIn) return;
    const body = JSON.stringify(list);
    const request = new Request('/api/highScores', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} })
    await fetch(request)
    .then((res) => res.json())
    .then((data) => {
      if (data === 'porbelm') {
        throw new Error('problem posting');
      }
    })
    .catch((e) => console.error(e));
  }

  function addScore(list: highScoreListType, newEntry: [number, string], index: number) {
    if (!isLoggedIn) return;
    if (index === -1) {
      return;
    } else if (index === 0) {
      list.unshift(newEntry);
      list.pop();
      setHighScores(list);
      addListToDB(list);
      return;
    } else if (index === list.length - 1) {
      list.pop();
      list.push(newEntry);
      setHighScores(list);
      addListToDB(list);
      return;
    } else {
      const front = list.slice(0, index);
      const back = list.slice(index + 1);
      front.push(newEntry);
      const newList = [...front, ...back];
      setHighScores(newList);
      addListToDB(newList);
      return;
    }
  };
  
  

  return (
    <>
    <div className="message-window-container" style={{display: showMessage ? 'flex' : 'none'}}>
      <MessageWindow content={messageContent} messageWindowClose={messageWindowClose} currentStamina={currentStamina} pointStaminaTextColor={pointStaminaTextColor(currentStamina)}/>
    </div>
    <HighScore showHighScores={showHighScores} highScores={highScores} newScoreIndex={newScoreIndex}/>

    <div className="overall-view">

      <div style={{display: gameState === 'login' ? 'block' : 'none'}}>
          <LoginView displayUserName={displayUserName} userIsRegistered={userIsRegistered} restoreGame={restoreGame}/>
      </div>

      <div className="board-side" style={{backgroundImage: `url(${imageList.waves})`, display: gameState === 'login' ? 'none' : 'block'}}>
        <GameOver gameState={gameState} hasArrived={currentPlayerPosition === numberOfSquares}/>

        <div style={{display: gameState === 'newGame' ? 'block' : 'none'}}>
          <NewGameSetup changeNumberOfSquares={changeNumberOfSquares} changePieceType={changePieceType} makeSquares={makeSquares} makeTreasure={makeTreasure}/>
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

            <div onMouseEnter={() => handleHover('points')} onMouseLeave={() => handleHover('none')} style={{color: pointStaminaTextColor(currentScore)}}>Points: <b>{currentScore}</b>
              <InfoDialog handleHover={handleHover} identifier="points" hover={hover}/>
            </div>

            <div onMouseEnter={() => handleHover('points')} onMouseLeave={() => handleHover('none')} style={{color: pointStaminaTextColor(currentStamina)}}>Stamina: <b>{currentStamina}</b>
            </div>

            <button onClick={() => changeLogin()}>Log out</button><br></br>
            <button disabled={gameState === 'wonGame' || isLoggedIn === false} onClick={() => saveGame()}>Save current game and log out?</button>
          </div>

          <div className="side-item" style={{margin: '2em'}}>
          <div>
            <Die dots={numberOnDie} rollDie={rollDie} canRollDie={canRollDie && !showMessage}/>
          </div>

          <div>
            <button onMouseEnter={() => handleHover('move')} onMouseLeave={() => handleHover('none')} disabled={gameState === 'wonGame' || canRollDie || showMessage} onClick={() => movePiece(numberOnDie)}>Move Forward<br></br> (- stamina)</button>
            <InfoDialog handleHover={handleHover} identifier='move' hover={hover}/>
            <br></br>
            <button onMouseEnter={() => handleHover('rest')} onMouseLeave={() => handleHover('none')} disabled={gameState === 'wonGame' || canRollDie || showMessage} onClick={() => rest()}>Rest and recover<br></br> (+ stamina)</button>
            <InfoDialog handleHover={handleHover} identifier='rest' hover={hover}/>
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
export type { queryMessageType, gameStateTypes, dialogTypes, highScoreListType, IgameSaveData }
