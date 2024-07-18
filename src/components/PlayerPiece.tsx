import './PlayerPiece.css';
import imageList from "../imageList";

/** Creates JSX for player's piece */
function PlayerPiece(props: {pieceType: string, pieceIsHere: boolean}) {
    const {pieceType, pieceIsHere} = props;
    const src = imageList[pieceType];
    
    return (
        <>
          <div className="player-piece" style={{display: pieceIsHere ? 'block' : 'none'}}>
            <img alt={pieceType} src={src}></img>
          </div>
        
        </>
    )
};

export default PlayerPiece