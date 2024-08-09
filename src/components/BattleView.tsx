import { useState, useMemo } from 'react';
import { calculateDamage, makeNewEnemy, calculateHitPercent } from '../calculations/battle-calculations';
import { pieceTypes, changeStaminaFromAttack, IShipStats, endBattle } from '../appTypes';
import ShipStatView from './ShipStatView';
import './BattleView.css';

function BattleView(props: {stamina: number, playerShip: pieceTypes, changeStaminaFromAttack: changeStaminaFromAttack, endBattle: endBattle, pointStaminaTextColor: 'black' | 'purple' | 'red'}) {
    const { stamina, playerShip, changeStaminaFromAttack, endBattle, pointStaminaTextColor } = props;
    const [currentEnemy, setCurrentEnemy] = useState<IShipStats>(makeNewEnemy);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [enemyValue, setEnemyValue] = useState(0);
    const [showBattleResults, setShowBattleResults] = useState(false);
    const [text, setText] = useState('');
    const [activeRowPlayer, setActiveRowPlayer] = useState('attack-row');
    const [activeRowEnemy, setActiveRowEnemy] = useState('stamina-row');
    const [battleMessage, setBattleMessage] = useState('');
    const [shaker, setShaker] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const playerStats = {
        name: 'Your Ship',
        speed: playerShip === 'sail' ? 8 : 4,
        attack: playerShip === 'sail' ? 4 : 8,
        guts: playerShip === 'sail' ? 5 : 4,
    };

    const currentStamina = useMemo(() => {
        return stamina;
    }, [stamina]);

    const [localPlayerObject, setLocalPlayerObject] = useState<IShipStats>({...playerStats, stamina: currentStamina});
    const playerHit = calculateHitPercent(localPlayerObject, currentEnemy);
    const enemyHit = calculateHitPercent(currentEnemy, localPlayerObject);

    function attack() {
        setButtonDisabled(true);
        const [damageDealt, message] = calculateDamage(localPlayerObject, currentEnemy);
        setBattleMessage(message);
        if (damageDealt > 0) {
            setShaker('shaker');
            setTimeout(() => {
                setShaker('');
            }, 500);
        }
        const newStamina = currentEnemy.stamina - damageDealt;
        setEnemyValue(newStamina > 0 ? damageDealt : currentEnemy.stamina);
        setTimeout(() => {
            setBattleMessage('');
            setButtonDisabled(false);
        }, 1000);
        if (newStamina <= 0) {
            setText("Alright! That'll show those pirates! And you got some of their loot too!");
            setTimeout(() => {
                setShowBattleResults(true);
            }, 1000);
            
        } else {
            setCurrentEnemy((currentEnemy) => ({...currentEnemy, stamina: newStamina}));
            setActiveRowPlayer('stamina-row');
            setActiveRowEnemy('attack-row');
            setPlayerTurn(false);
        }
    };

    function getAttacked() {
        setButtonDisabled(true);
        const [damageDealt, message] = calculateDamage(currentEnemy, localPlayerObject);
        if (damageDealt > 0) {
            setShaker('shaker');
            setTimeout(() => {
                setShaker('');
            }, 500);
        }
        setBattleMessage(message);
        const newStamina = stamina - damageDealt;
        setTimeout(() => {
            setBattleMessage('');
            setButtonDisabled(false);
        }, 1000);
        if (newStamina <= 0) {
            setText('Ouch! Bit off more than you could chew, eh?');
        } else {
            setPlayerTurn(true);
            setText("Alright! You frightened them off! Might as well grab some of their stuff while your at it!");
        }
        setTimeout(() => {
            setShowBattleResults(true);
        }, 1000);
        
        changeStaminaFromAttack(newStamina);
        setLocalPlayerObject(() => ({...localPlayerObject, stamina: newStamina}));
    };

    function handleEndBattle() {
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
          { !showBattleResults ? 
          <div className="battle-message">
            {battleMessage}
          </div> :
          null
          }
          {showBattleResults ? <div className="message-window-container" style={{display: 'flex'}} data-testid="battle-results-window">{resultsDisplay}</div> : null}
          {!showBattleResults ? 
          <div className={shaker}>
            <ShipStatView name={localPlayerObject.name} attack={localPlayerObject.attack} stamina={currentStamina} speed={localPlayerObject.speed} hit={playerHit} activeRow={activeRowPlayer}/>
            <ShipStatView name={currentEnemy.name} attack={currentEnemy.attack} stamina={currentEnemy.stamina} speed={currentEnemy.speed} hit={enemyHit} activeRow={activeRowEnemy}/>
          <div>
            { !showBattleResults ?
            <button onClick={playerTurn ? attack : getAttacked} disabled={buttonDisabled}>
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