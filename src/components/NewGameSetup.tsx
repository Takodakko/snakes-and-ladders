import { useState, useId, useMemo } from 'react';
import './NewGameSetup.css';
import { changeNumberOfSquares, changePieceType, pieceTypes, makeSquares, makeTreasure } from '../appTypes';

/** Creates the view for choosing game settings before starting a new game */
function NewGameSetup(props: {changeNumberOfSquares: changeNumberOfSquares, changePieceType: changePieceType, makeSquares: makeSquares, makeTreasure: makeTreasure}) {
    const { changePieceType, changeNumberOfSquares, makeSquares, makeTreasure } = props;
    const [number, setNumber] = useState(25);
    const [points, setPoints] = useState(0);

    /** Displays how much stamina user will start with based on starting points and number of tiles */
    const staminaResult = useMemo(() => {
      const result = number - points - 1;
      return result;
    }, [number, points]);

    /** Displays drop down choices for how many points to start game with and number of tiles */
    const startingPointOptions = useMemo(() => {
      const upperBound = number - 1;
      const options: JSX.Element[] = [];
      for (let i = 0; i < upperBound; i++) {
        options.push(<option key={i} value={i}>{i}</option>)
      }
      return options;
    }, [points, number]);

    const [tileNumberWarning, setTileNumberWarning] = useState(false);
    const tilesInputId = useId();
    const pieceTypeId = useId();
    const stamId = useId();


    const [currentPieceType, setCurrentPieceType] = useState('sail');
    const listOfTypeNames: pieceTypes[] = ['sail', 'cargo'];
    const selectors = listOfTypeNames.map((e) => {
        return <option key={e} value={e}>{e}</option>
    });
    

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTileNumberWarning(false);
        if (number > 1 && number < 51) {
            changeNumberOfSquares(number, staminaResult, points);
            changePieceType(currentPieceType);
            makeSquares(number, null);
            makeTreasure(number, null);
        } else {
            setTileNumberWarning(true);
            setTimeout(() => {
                setTileNumberWarning(false);
            }, 1500);
        }
    }

    return (
        <div>
            <div style={{display: tileNumberWarning ? 'block' : 'none', color: 'red'}}>
                Enter a number between 2 and 50
            </div>
            <form className="new-game-view" onSubmit={handleSubmit}>
              <label htmlFor={tilesInputId}>
                How many tiles do you want? (2-50)
              </label>
              <input id={tilesInputId} type="number" name="numberoftilesinput" value={number < 51 && number > 0 ? number : ''} onChange={(n) => {
                setNumber(parseInt(n.target.value));
                setPoints(0);
                }}>
              </input>
              
              <label htmlFor={stamId}>
                More points for less stamina?
              </label>
              <div>
                Starting points:
              <select id={stamId} value={points} onChange={(p) => setPoints(parseInt(p.target.value))}>
                {startingPointOptions}
              </select>
              </div>
              <div>
                Starting Stamina: 
              <input disabled={true} value={staminaResult}></input>
              </div>

              <label htmlFor={pieceTypeId}>
                What type of ship will you use?
              </label>
              <select id={pieceTypeId} value={currentPieceType} onChange={(t) => setCurrentPieceType(t.target.value)}>
                {selectors}
              </select>
              <button onSubmit={handleSubmit}>
                Start Game
              </button>
            </form>
        </div>
    )
}

export default NewGameSetup