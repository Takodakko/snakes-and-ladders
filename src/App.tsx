import { useState, useCallback, useEffect } from 'react';
import Board from './components/Board';
import LoginView from './components/LoginView';
import NewGameSetup from './components/NewGameSetup';
import Die from './components/Die';
import HighScore from './components/HighScore';
import InfoDialog from './components/InfoDialog';
import MessageWindow from './components/MessageWIndow';
import boardDeterminers from './calculations/board-characteristics';
import saveRestoreDeleteGame from './calculations/save-restore-delete-game';
const { saveGame, restoreGame, deleteGame } = saveRestoreDeleteGame;
import GameOver from './components/GameOver';
import imageList from './imageList';
import './App.css';
import {
  squareStyleAttributes,
  treasureTrapMap,
  highScoreListType,
  gameStateTypes,
  dialogTypes,
  queryMessageType,
  userIsRegistered,
  IgameSaveData,
  pieceTypes,
  makeTreasure,
  makeSquares,
  changePieceType,
  changeNumberOfSquares,
  messageWindowClose,
  restoreGameFromLocalOrDB,
  displayUserName,
  handleHover,
  rollDie,
  dbHighScores,
} from './appTypes';

function App() {

  // ------------------- log in and new game related ----------------
  
  const [userName, setUserName] = useState('');

  function changeLogin() {
    startOver();
    setUserName('');
    setGameState('login');
    setIsLoggedIn(false);
  }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userIsRegistered: userIsRegistered = (yes: boolean) => {
    setIsLoggedIn(yes);
  };

  const [gameState, setGameState] = useState<gameStateTypes>('login');

  function startOver() {
    setGameState('newGame');
    setCurrentPlayerPosition(1);
    setCanRollDie(true);
    setCurrentScore(0);
    setShowMessage(false);
    setMessageContent([...queryMessage]);
    setCurrentStamina(1);
    setShowHighScores(false);
    setNewScoreIndex(-1);
    setDataToSave(null);
  }

  /** Sets user name to show on screen, and either starts game from save or moves to set up step if no save */
  const displayUserName: displayUserName = (name: string, hasSetup: boolean) => {
    setUserName(name);
    setGameState(hasSetup ? 'newGame' : 'playingGame');
  };

  const newGameButtonClass = gameState === 'wonGame' ? 'new-game-pulse' : '';

// ------------------ Game setup --------------------------
  const [numberOfSquares, setNumberOfSquares] = useState(25);
  const [currentStamina, setCurrentStamina] = useState(1);

  const changeNumberOfSquares: changeNumberOfSquares = (num: number, stamina: number, points: number) => {
    setNumberOfSquares(num);
    setCurrentStamina(stamina);
    setCurrentScore(points);
    setGameState('playingGame');
  };
  

  const [chosenPieceType, setChosenPieceType] = useState<pieceTypes>('sail');

  const changePieceType: changePieceType = (type: string) => {
    if (type !== 'sail' && type !== 'cargo') {
      return;
    }
    setChosenPieceType(type);
  };

  // --------------------- While playing --------------------------------

  const [currentPlayerPosition, setCurrentPlayerPosition] = useState(1);
  const [numberOnDie, setNumberOnDie] = useState(1);
  const [canRollDie, setCanRollDie] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const queryMessage: queryMessageType = ['query', 0, "Do you wish to explore for -1 stamina? There are sometimes risks, but sometimes rewards..."];
  const [messageContent, setMessageContent] = useState<queryMessageType>([...queryMessage]);

  const rollDie: rollDie = (num: number) => {
    setNumberOnDie(num);
    setCanRollDie(false);
    setMessageContent([...queryMessage]);
  };

  function exploreIsland() {
    const newStamina = currentStamina - 1;
    setCurrentStamina(currentStamina - 1);
    const currentMessageContent = treasuresAndTrapsData.get(currentPlayerPosition) ?? ['nothing', 0, "The island was quiet and empty. You explore a little, but there doesn't seem to be anything interesting here."];
    setMessageContent([...currentMessageContent]);
    setShowMessage(true);
    addToScore(currentMessageContent[1]);
    if (newStamina <= 0) {
      setGameState('wonGame');
      setShowMessage(false);
    }
  };

  /** Progresses window to next step, either closing it, or changing text if player explores */
  const messageWindowClose: messageWindowClose = (onlyClose: boolean) => {
    if (onlyClose) {
      setShowMessage(false);
      saveGameData(currentScore, currentStamina);
    } else {
      exploreIsland();
    }
  };

  /** Moves player piece to next tile */
  const movePiece = async (num: number) => {
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

  /** Performs rest action */
  function rest() {
    const halfOfDie = Math.floor(numberOnDie / 2);
    setCurrentStamina(currentStamina + halfOfDie);
    setCurrentScore(currentScore - 1);
    setCanRollDie(true);
    saveGameData(currentScore - 1, currentStamina + halfOfDie);
  };

  /** Adds to player's current score */
  function addToScore(num: number) {
    setCurrentScore(currentScore + num);
  };

  /** Changes color of points and stamina text when they get low */
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

  const handleHover: handleHover = (dialogType: dialogTypes = 'none') => {
    setHover(dialogType);
  }

  // --------------------- Data to save state of game -----------------------
  const { squareAttributes, placeTreasuresAndTraps } = boardDeterminers;
  const [chosenSquareData, setChosenSquareData] = useState<squareStyleAttributes>(squareAttributes(2));
  const [treasuresAndTrapsData, setTreasuresAndTrapsData] = useState<treasureTrapMap>(placeTreasuresAndTraps(2));
  
  /** Either recreates islands from saved data or creates from scratch */
  const makeSquares: makeSquares = (num: number, data: squareStyleAttributes | null) => {
    const squares = data ? data : squareAttributes(num);
    setChosenSquareData(squares);
  };

  /** Either uses saved data or creates treasure and trap data from scratch */
  const makeTreasure: makeTreasure = (num: number, data: treasureTrapMap | null) => {
    const treasure = data ? data : placeTreasuresAndTraps(num);
    setTreasuresAndTrapsData(treasure);
  };

  const [dataToSave, setDataToSave] = useState<IgameSaveData | null>(null);

  /** Save data if user is logged in, unused otherwise */
  const saveGameData = (points: number, stamina: number) => {
    if (!isLoggedIn) {
      setDataToSave(null);
    } else {
      console.log('saving...')
      const data: IgameSaveData = {
        chosenPieceType,
        currentPlayerPosition,
        numberOfSquares,
        userName,
        chosenSquareData,
        currentScore: points,
        currentStamina: stamina,
        treasuresAndTrapsData,
      };
       setDataToSave({...data});
       saveGame(data, points, stamina, userName, true);
    }
  };

  /** Saves at the end of each turn when window closes, disabled if user is not logged in */
  async function saveGameAndEnd() {
    if (!dataToSave) {
      console.log('no dataToSave');
      return;
    }
      const isSuccessful = await saveGame(dataToSave, currentScore, currentStamina, userName, false);
      if (isSuccessful) {
        console.log('saved');
        setGameState('login');
      } else {
        console.log('not saved');
        setGameState('login');
      }
  };

  /** Tries to restore game either from local storage or DB and informs if successful */
     const restoreGameFromLocalOrDB: restoreGameFromLocalOrDB = async (name: string) => {
       const gameData = await restoreGame(name);
       if (gameData !== null) {
        setDataToSave(gameData);
        makeSquares(gameData.numberOfSquares, gameData.chosenSquareData);
        makeTreasure(gameData.numberOfSquares, gameData.treasuresAndTrapsData);
        setGameState('playingGame');
        return true;
       } else {
        setDataToSave(null);
        setGameState('newGame');
        return false;
       }
     };


  /** Deletes save game data if user logs out or starts over */
  const endAndDeleteGame = async () => {
    if (!isLoggedIn) {
      return;
    }
    const isSuccessful = await deleteGame(userName);
    if (isSuccessful) {
      console.log('deleted');
    } else {
      console.log('not deleted');
    }
  };

  // --------------------- High Score --------------------
  
  const fakeList = [[100, 'Edelgard'], [90, 'Hubert'], [85, 'Linhardt'], [70, 'Ferdinand'], [60, 'Dorothea'], [55, 'Petra'], [10, 'Bernadetta'], [-10, 'Caspar']];
  const [highScores, setHighScores] = useState<any[]>([...fakeList]); // useEffect get list or use fake if failure
  const [showHighScores, setShowHighScores] = useState(false);
  const [newScoreIndex, setNewScoreIndex] = useState(-1);

  useEffect(() => {
    async function fetchData() {
      const newScores = await fetch('/api/highScores', {method: 'GET'})
      .then((res) => {
        const data = res.json();
        return data;
      })
      .then((jdata) => {
        if (!jdata) {
          return null;
        } else {
          return jdata;
        }
      })
      .catch((e) => {
        console.error(e, 'error');
        return null;
      });
      if (newScores !== null) {
        const arrayified: highScoreListType = [];
        newScores.forEach((entry: dbHighScores) => {
          arrayified.push([entry.score, entry.name]);
        });
        setHighScores([...arrayified]);
      }
    };
    fetchData();
  }, [showHighScores]);


  /** Checks if winning user's score should be entered in high score list */
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

  /** Posts updated high score list to DB */
  async function addEntryToDB(entry: [number, string]) {
    if (!isLoggedIn) return;
    const body = JSON.stringify({name: entry[1], score: entry[0]});
    const request = new Request('/api/highScores', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} })
    await fetch(request)
    .then((res) => res.json())
    .then((data) => {
      if (data.entry === 'fail') {
        console.error('problem saving to DB');
      } else {
        console.log(data.entry, 'data.entry');
      }
    })
    .catch((e) => console.error(e));
  }

  /** Adds user's score to high score list if appropriate */
  function addScore(list: highScoreListType, newEntry: [number, string], index: number) {
    if (!isLoggedIn) return;
    if (index === -1) {
      return;
    } else if (index === 0) {
      list.unshift(newEntry);
      list.pop();
      setHighScores([...list]);
      addEntryToDB(newEntry);
      return;
    } else if (index === list.length - 1) {
      list.pop();
      list.push(newEntry);
      setHighScores([...list]);
      addEntryToDB(newEntry);
      return;
    } else {
      const front = list.slice(0, index);
      const back = list.slice(index + 1);
      front.push(newEntry);
      const newList = [...front, ...back];
      setHighScores([...newList]);
      addEntryToDB(newEntry);
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
          <LoginView displayUserName={displayUserName} userIsRegistered={userIsRegistered} restoreGameFromLocalOrDB={restoreGameFromLocalOrDB}/>
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

            <button onClick={() => {
              endAndDeleteGame();
              changeLogin();
            }}>Log out</button><br></br>
            <button disabled={gameState === 'wonGame' || isLoggedIn === false} onClick={() => saveGameAndEnd()}>Save current game and log out?</button>
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
            <button className={newGameButtonClass} onClick={() => {
              endAndDeleteGame();
              startOver();
              }}>New Game?</button>
          </div>
        </div>
      </div>

    </div>
    </>
  )
}

export default App
