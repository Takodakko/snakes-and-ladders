import { useState, useCallback, useEffect } from 'react';
import Board from './components/Board';
import LoginView from './components/LoginView';
import NewGameSetup from './components/NewGameSetup';
import Die from './components/Die';
import HighScore from './components/HighScore';
import InfoDialog from './components/InfoDialog';
import MessageWindow from './components/MessageWindow';
import BattleView from './components/BattleView';
import { decideIslandAttributes, treasureTypeDictionary } from './calculations/board-characteristics';
import saveRestoreDeleteGame from './calculations/save-restore-delete-game';
import highScoreCalculations from './calculations/high-score-calculations';
// import { makeNewEnemy } from './calculations/battle-calculations';
const { saveGame, restoreGame, deleteGame } = saveRestoreDeleteGame;
const { addScoreToList, checkScoreAgainstList, fakeList } = highScoreCalculations;
import { getAllHighScoresFromDB, addNewHighScoreToDB } from './api';
import GameOver from './components/GameOver';
import imageList from './imageList';
import './App.css';
import {
  islandAttributes,
  treasureTrapMessageData,
  highScoreListType,
  gameStateTypes,
  dialogTypes,
  queryMessageType,
  userIsRegistered,
  IgameSaveData,
  pieceTypes,
  makeSquares,
  changePieceType,
  changeNumberOfSquares,
  messageWindowClose,
  restoreGameFromLocalOrDB,
  displayUserName,
  handleHover,
  rollDie,
  dbHighScores,
  changeStaminaFromAttack,
  endBattle,
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
    setInBattle(false);
  }

  /** Sets user name to show on screen, and either starts game from save or moves to set up step if no save */
  const displayUserName: displayUserName = (name: string, hasSetup: boolean) => {
    setUserName(name);
    setGameState(hasSetup ? 'newGame' : 'playingGame');
    setInBattle(false);
  };

  const newGameButtonClass = gameState === 'finishedGame' ? 'new-game-pulse' : '';

// ------------------ Game setup --------------------------
  const [numberOfSquares, setNumberOfSquares] = useState(25);
  const [currentStamina, setCurrentStamina] = useState(1);

  const changeNumberOfSquares: changeNumberOfSquares = (num: number, stamina: number, points: number) => {
    setNumberOfSquares(num);
    setCurrentStamina(stamina);
    setCurrentScore(points);
    setGameState('playingGame');
    setInBattle(false);
  };
  

  const [chosenPieceType, setChosenPieceType] = useState<pieceTypes>('sail');

  const changePieceType: changePieceType = (type: pieceTypes) => {
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
  const [inBattle, setInBattle] = useState(false);

  const rollDie: rollDie = (num: number) => {
    setNumberOnDie(num);
    setCanRollDie(false);
    setMessageContent([...queryMessage]);
  };

  function exploreIsland() {
    const newStamina = currentStamina - 1;
    setCurrentStamina(newStamina);
    const messageForIsland = chosenIslandData.get(currentPlayerPosition);
    const currentMessageContent: treasureTrapMessageData = messageForIsland ? treasureTypeDictionary[messageForIsland[5]] : treasureTypeDictionary['nothing'];
    setMessageContent([...currentMessageContent]);
    setShowMessage(true);
    addToScore(currentMessageContent[1]);
    if (newStamina <= 0) {
      setGameState('finishedGame');
      setShowMessage(false);
    }
  };

  /** Progresses window to next step, either closing it, or changing text if player explores */
  const messageWindowClose: messageWindowClose = (onlyClose: boolean, battle: boolean) => {
    if (onlyClose) {
      if (!battle) {
        setShowMessage(false);
        autoSaveGameData(currentScore, currentStamina);
      } else {
        enterBattle();
        setShowMessage(false);
      }
    } else {
        exploreIsland();
    }
  };

  function enterBattle() {
    setInBattle(true);
    // const newEnemy = makeNewEnemy();
    // setCurrentEnemy({...newEnemy});
  };

  /** Changes stamina if attack succeeds */
  const changeStaminaFromAttack: changeStaminaFromAttack = (newStamina: number) => {
    
      setCurrentStamina(newStamina);
    
    // else {
    //   setCurrentEnemy({...currentEnemy, stamina: newStamina});
    // }
    
  };

  /** Ends battle and set loss condition or adds to points */
  const endBattle: endBattle = (lost: boolean, points: number) => {
    if (lost) {
      setGameState('finishedGame');
      setShowMessage(false);
    } else {
      setInBattle(false);
      messageWindowClose(true, false);
      setCurrentScore(currentScore + points);
    }
    
  };

  // const [currentEnemy, setCurrentEnemy] = useState(makeNewEnemy);

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
      setGameState('finishedGame');
      checkList(highScores, [currentScore, userName]);
      removeSavedGameData();
      setTimeout(() => {
        setShowHighScores(true);
      }, 3000);
    } else {
      if (newStamina <= 0) {
        setGameState('finishedGame');
        setShowMessage(false);
        removeSavedGameData();
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
    autoSaveGameData(currentScore - 1, currentStamina + halfOfDie);
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
  const [chosenIslandData, setChosenIslandData] = useState<islandAttributes>(decideIslandAttributes(2));
  
  /** Either recreates islands from saved data or creates from scratch */
  const makeSquares: makeSquares = (num: number, data: islandAttributes | null, score: number, stamina: number, position: number) => {
    const squares = data ? data : decideIslandAttributes(num);
    setChosenIslandData(squares);
    setNumberOfSquares(num);
    setCurrentScore(score);
    setCurrentStamina(stamina);
    setCurrentPlayerPosition(position);
  };

  const [dataToSave, setDataToSave] = useState<IgameSaveData | null>(null);

  /** Save data at end of each turn if user is logged in, unused otherwise */
  const autoSaveGameData = (points: number, stamina: number) => {
    if (!isLoggedIn) {
      setDataToSave(null);
    } else {
      console.log('saving...')
      const data: IgameSaveData = {
        chosenPieceType,
        currentPlayerPosition,
        numberOfSquares,
        userName,
        chosenIslandData,
        currentScore: points,
        currentStamina: stamina,
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
      makeSquares(gameData.numberOfSquares, gameData.chosenIslandData, gameData.currentScore, gameData.currentStamina, gameData.currentPlayerPosition);
      setGameState('playingGame');
      setInBattle(false);
      return true;
    } else {
      setDataToSave(null);
      setGameState('newGame');
      setInBattle(false);
      return false;
    }
  };


  /** Deletes save game data if user logs out or starts over or finishes by win or loss */
  const removeSavedGameData = async () => {
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
  
  const [highScores, setHighScores] = useState<highScoreListType>([...fakeList]); // useEffect get list or use fake if failure
  const [showHighScores, setShowHighScores] = useState(false);
  const [newScoreIndex, setNewScoreIndex] = useState(-1);

  useEffect(() => {
    async function fetchData() {
      const newScores: dbHighScores[] | null = await getAllHighScoresFromDB();
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
    const index = checkScoreAgainstList(list, newEntry);
    if (index !== -1) {
      setNewScoreIndex(index);
      addScore(list, newEntry, index);
    }
  };

  /** Posts new high score to DB */
  async function addEntryToDB(entry: [number, string]) {
    if (!isLoggedIn) return;
    const result: Record<string, string> = await addNewHighScoreToDB(entry[1], entry[0]);
    console.log(result.entry);
  }

  /** Adds user's score to high score list if appropriate */
  function addScore(list: highScoreListType, newEntry: [number, string], index: number) {
    if (!isLoggedIn) return;
    if (index === -1) {
      return;
    } else {
      const newList = addScoreToList(list, newEntry, index);
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
    
    <div style={{display: inBattle ? 'block' : 'none'}} className="battle-view">
      {inBattle ? <BattleView points={currentScore} stamina={currentStamina} playerShip={chosenPieceType} changeStaminaFromAttack={changeStaminaFromAttack} endBattle={endBattle} pointStaminaTextColor={pointStaminaTextColor(currentStamina)}/> : null}
    </div>

    <div style={{display: inBattle ? 'none' : 'flex'}} className="overall-view">

      <div style={{display: gameState === 'login' ? 'block' : 'none'}}>
          <LoginView displayUserName={displayUserName} userIsRegistered={userIsRegistered} restoreGameFromLocalOrDB={restoreGameFromLocalOrDB}/>
      </div>

      <div className="board-side" style={{backgroundImage: `url(${imageList.waves})`, display: gameState === 'login' ? 'none' : 'block'}}>
        <GameOver gameState={gameState} hasArrived={currentPlayerPosition === numberOfSquares}/>

        <div style={{display: gameState === 'newGame' ? 'block' : 'none'}}>
          <NewGameSetup changeNumberOfSquares={changeNumberOfSquares} changePieceType={changePieceType} makeSquares={makeSquares}/>
        </div>

        <div className="card" style={{display: gameState === 'playingGame' || gameState === 'finishedGame' ? 'block' : 'none'}}>
          <Board numberOfSquares={numberOfSquares} pieceType={chosenPieceType} playerPosition={currentPlayerPosition} chosenIslandData={chosenIslandData}/>
        </div>
      </div>

      <div style={{display: gameState === 'playingGame' || gameState === 'finishedGame' ? 'block' : 'none'}}>
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
              removeSavedGameData();
              changeLogin();
            }}>Log out</button><br></br>
            <button disabled={gameState === 'finishedGame' || isLoggedIn === false} onClick={() => saveGameAndEnd()}>Save current game and log out?</button>
          </div>

          <div className="side-item" style={{margin: '2em'}}>
          <div>
            <Die dots={numberOnDie} rollDie={rollDie} canRollDie={canRollDie && !showMessage}/>
          </div>

          <div>
            <button onMouseEnter={() => handleHover('move')} onMouseLeave={() => handleHover('none')} disabled={gameState === 'finishedGame' || canRollDie || showMessage} onClick={() => movePiece(numberOnDie)}>Move Forward<br></br> (- stamina)</button>
            <InfoDialog handleHover={handleHover} identifier='move' hover={hover}/>
            <br></br>
            <button onMouseEnter={() => handleHover('rest')} onMouseLeave={() => handleHover('none')} disabled={gameState === 'finishedGame' || canRollDie || showMessage} onClick={() => rest()}>Rest and recover<br></br> (+ stamina)</button>
            <InfoDialog handleHover={handleHover} identifier='rest' hover={hover}/>
          </div>
          </div>

          <div className="side-item" style={{margin: '2em'}}>
            <button className={newGameButtonClass} onClick={() => {
              removeSavedGameData();
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
