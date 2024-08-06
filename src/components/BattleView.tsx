import { useState, useMemo } from 'react';
import { calculateDamage, makeNewEnemy, calculateHitPercent } from '../calculations/battle-calculations';
import { pieceTypes, changeStaminaFromAttack, IShipStats, endBattle } from '../appTypes';
import ShipStatView from './ShipStatView';
import './BattleView.css';

function BattleView(props: {points: number, stamina: number, playerShip: pieceTypes, changeStaminaFromAttack: changeStaminaFromAttack, endBattle: endBattle, pointStaminaTextColor: 'black' | 'purple' | 'red'}) {
    const { points, stamina, playerShip, changeStaminaFromAttack, endBattle, pointStaminaTextColor } = props;
    const [currentEnemy, setCurrentEnemy] = useState<IShipStats>(makeNewEnemy);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [enemyValue, setEnemyValue] = useState(0);
    const [showBattleResults, setShowBattleResults] = useState(false);
    const [text, setText] = useState('');
    const [activeRowPlayer, setActiveRowPlayer] = useState('attack-row');
    const [activeRowEnemy, setActiveRowEnemy] = useState('stamina-row');

    const playerStats = {
        name: 'Your Ship',
        speed: playerShip === 'sail' ? 8 : 4,
        attack: playerShip === 'sail' ? 4 : 8,
    };

    const currentStamina = useMemo(() => {
        return stamina;
    }, [stamina]);

    const [localPlayerObject, setLocalPlayerObject] = useState<IShipStats>({...playerStats, stamina: currentStamina});
    const playerHit = calculateHitPercent(localPlayerObject, currentEnemy);
    const enemyHit = calculateHitPercent(currentEnemy, localPlayerObject);

    function attack() {
        const damageDealt = calculateDamage(localPlayerObject, currentEnemy);
        const newStamina = currentEnemy.stamina - damageDealt;
        setEnemyValue(newStamina > 0 ? damageDealt : currentEnemy.stamina);
        if (newStamina <= 0) {
            
            setText("Alright! That'll show those pirates! And you got some of their loot too!");
            setShowBattleResults(true);
        } else {
            setCurrentEnemy((currentEnemy) => ({...currentEnemy, stamina: newStamina}));
            setActiveRowPlayer('stamina-row');
            setActiveRowEnemy('attack-row');
            setPlayerTurn(false);
        }
    };

    function getAttacked() {
        const damageDealt = calculateDamage(currentEnemy, localPlayerObject);
        const newStamina = stamina - damageDealt;
        if (newStamina <= 0) {
            setText('Ouch! Bit off more than you could chew, eh?');
        } else {
            setPlayerTurn(true);
            setText("Alright! You frightened them off! Might as well grab some of their stuff while your at it!");
        }
        setShowBattleResults(true);
        changeStaminaFromAttack(newStamina);
        setLocalPlayerObject(() => ({...localPlayerObject, stamina: newStamina}));
    };

    function handleEndBattle() {
        console.log(enemyValue, 'enemyValue');
        if (currentStamina <= 0) {
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
      {currentStamina > 0 ? `Points gained: ${enemyValue}` : ''}
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
          {showBattleResults ? <div className="message-window-container" style={{display: 'flex'}} data-testid="battle-results-window">{resultsDisplay}</div> : null}
          {!showBattleResults ? 
          <div>
            <ShipStatView name={localPlayerObject.name} attack={localPlayerObject.attack} stamina={currentStamina} speed={localPlayerObject.speed} hit={playerHit} activeRow={activeRowPlayer}/>
            <ShipStatView name={currentEnemy.name} attack={currentEnemy.attack} stamina={currentEnemy.stamina} speed={currentEnemy.speed} hit={enemyHit} activeRow={activeRowEnemy}/>
          <div>
            { !showBattleResults ?
            <button onClick={playerTurn ? attack : getAttacked}>
                {playerTurn ? 'Attack!' : 'Defend!'}
            </button>
            :
            null
            }
          </div>
          </div>
          : null
          }
        </>
    )
};

export default BattleView;