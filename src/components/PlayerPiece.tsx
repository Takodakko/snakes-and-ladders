import './PlayerPiece.css';

function PlayerPiece(props: {pieceType: string, pieceIsHere: boolean}) {
    const {pieceType, pieceIsHere} = props;
  
    return (
        <>
          <div className="player-piece" style={{display: pieceIsHere ? 'block' : 'none'}}>
            <img src={pieceType}></img>
          </div>
        
        </>
    )
};

export default PlayerPiece