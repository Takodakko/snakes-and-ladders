import './Square.css';
import PlayerPiece from './PlayerPiece';
type styleAttributesType = [number, number, string, string, number]

function Square(props: {tileNumber: string, pieceType: string, hasPiece: boolean, styleAttributes: styleAttributesType}) {
    const {tileNumber, pieceType, hasPiece, styleAttributes} = props;
    
    const margin = styleAttributes[0];
    const padding = styleAttributes[1];
    const backgroundColor = styleAttributes[2];
    const radiusPercents = styleAttributes[3];
    const borderWidth = styleAttributes[4];
    
    return (
      <>
        <div className="square" style={{padding: padding, margin: margin, backgroundColor: backgroundColor, borderWidth: borderWidth, borderRadius: radiusPercents}}>
          <b>{tileNumber}</b>
          <PlayerPiece pieceType={pieceType} pieceIsHere={hasPiece}/>
        </div>
      </>
    )
  }
  
  export default Square