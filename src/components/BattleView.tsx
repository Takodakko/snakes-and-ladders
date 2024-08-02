import { useState, useMemo } from 'react';
import { calculateDamage, makeNewEnemy } from '../calculations/battle-calculations';
import { pieceTypes, changeStaminaFromAttack, IShipStats, endBattle } from '../appTypes';
import './BattleView.css';

function BattleView(props: {points: number, stamina: number, playerShip: pieceTypes, changeStaminaFromAttack: changeStaminaFromAttack, endBattle: endBattle, pointStaminaTextColor: 'black' | 'purple' | 'red'}) {
    const { points, stamina, playerShip, changeStaminaFromAttack, endBattle, pointStaminaTextColor } = props;
    const [currentEnemy, setCurrentEnemy] = useState<IShipStats>(makeNewEnemy);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [enemyValue, setEnemyValue] = useState(0);
    const [showBattleResults, setShowBattleResults] = useState(false);
    const [text, setText] = useState('');

    const playerStats = {
        speed: playerShip === 'sail' ? 8 : 4,
        attack: playerShip === 'sail' ? 4 : 8,
    };

    const currentStamina = useMemo(() => {
        return stamina;
    }, [stamina]);

    const [localPlayerObject, setLocalPlayerObject] = useState<IShipStats>({...playerStats, stamina: currentStamina});

    function attack() {
        console.log(enemyValue, 'enemyValue');
        const damageDealt = calculateDamage(localPlayerObject, currentEnemy);
        const newStamina = currentEnemy.stamina - damageDealt;
        setEnemyValue(newStamina > 0 ? damageDealt : currentEnemy.stamina);
        if (newStamina <= 0) {
            // endBattle(false, enemyValue);
            setText("Alright! That'll show those pirates! And you got some of their loot too!");
            setShowBattleResults(true);
        } else {
            setCurrentEnemy((currentEnemy) => ({...currentEnemy, stamina: newStamina}));
            //changeStaminaFromAttack(currentEnemy.stamina - damageDealt, false);
            setPlayerTurn(false);
        }
    };

    function getAttacked() {
        console.log(enemyValue, 'enemyValue');
        const damageDealt = calculateDamage(currentEnemy, localPlayerObject);
        const newStamina = stamina - damageDealt;
        if (newStamina <= 0) {
            // endBattle(true, 0);
            setText('Ouch! Bit off more than you could chew, eh?');
            setShowBattleResults(true);
        } else {
            changeStaminaFromAttack(newStamina);
            setLocalPlayerObject(() => ({...localPlayerObject, stamina: newStamina}));
            setPlayerTurn(true);
            // endBattle(false, enemyValue);
            setText("Alright! You frightened them off! Might as well grab some of their stuff while your at it!");
            setShowBattleResults(true);
        }
    };

    function handleEndBattle() {
        console.log(enemyValue, 'enemyValue');
        if (stamina <= 0) {
            endBattle(true, 0);
        } else {
            if (currentEnemy.stamina > 0) {
                endBattle(false, enemyValue);
            } else {
                endBattle(false, enemyValue);
            }
        }
    };

    const resultsDisplay = <div className="message-window">
    <div>
      {text}<br></br> 
      {stamina > 0 ? `Points gained: ${enemyValue}` : ''}
    </div>
    <div style={{color: pointStaminaTextColor}}>Current Stamina: {currentStamina}</div>
    <div className="button-container">
    <button onClick={handleEndBattle}>
      Ok
    </button>
    </div>
  </div>
    
    return (
        <>
          <div>
            Props Stamina: {stamina}<br></br>
            Points: {points}<br></br>
            Attack: {localPlayerObject.attack}<br></br>
            Stamina: {localPlayerObject.stamina}<br></br>
            PrevStamina: {currentStamina}<br></br>
            Speed: {localPlayerObject.speed}
          </div>
          <div>
            Enemy: <br></br>
            Attack: {currentEnemy.attack}<br></br>
            Stamina: {currentEnemy.stamina}<br></br>
            Speed: {currentEnemy.speed}
          </div>
          {showBattleResults ? <div className="message-window-container" style={{display: 'flex'}}>{resultsDisplay}</div> : null}
          <div>
            { !showBattleResults ?
            <button onClick={playerTurn ? attack : getAttacked}>
                {playerTurn ? 'Attack!' : 'Defend!'}
            </button>
            :
            null
            }
          </div>
        </>
    )
};

export default BattleView;