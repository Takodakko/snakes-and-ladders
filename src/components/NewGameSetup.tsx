import { useState, useId } from 'react';
import './NewGameSetup.css';

/** Creates the view for choosing game settings before starting a new game */
function NewGameSetup(props: {changeNumberOfSquares: Function, changePieceType: Function}) {
    const { changePieceType, changeNumberOfSquares } = props;
    const [number, setNumber] = useState(25);
    const [tileNumberWarning, setTileNumberWarning] = useState(false);
    const tilesInputId = useId();
    const pieceTypeId = useId();


    const [currentPieceType, setCurrentPieceType] = useState('sail');
    const listOfTypeNames: string[] = ['sail', 'cargo'];
    const selectors = listOfTypeNames.map((e) => {
        return <option key={e} value={e}>{e}</option>
    });
    

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTileNumberWarning(false);
        if (number > 1 && number < 51) {
            changeNumberOfSquares(number);
            changePieceType(currentPieceType);
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
              </label><br></br>
              <input id={tilesInputId} type="number" name="numberoftilesinput" value={number < 51 && number > 0 ? number : ''} onChange={(n) => setNumber(parseInt(n.target.value))}>
              </input>
              <label htmlFor={pieceTypeId}>
                What type of ship will you use?
              </label><br></br>
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