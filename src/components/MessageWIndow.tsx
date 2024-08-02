import './MessageWindow.css';
import { queryMessageType, messageWindowClose } from '../appTypes';
import imageList from '../imageList';

/** Creates windows that display each turn when player moves */
function MessageWindow(props: {content: queryMessageType, messageWindowClose: messageWindowClose, currentStamina: number, pointStaminaTextColor: 'black' | 'purple' | 'red'}) {
  const { content, messageWindowClose, currentStamina, pointStaminaTextColor } = props;
  
  const eventType = content[0];
  const isQuery = eventType === 'query';
  const isBattle = eventType === 'enemy';
  const points = content[1];
  const text = content[2];

  const battleButtonText = isBattle ? 'Uh-oh!' : 'Ok';

  const buttonText = isQuery ? "Yeah, let's go for it!" : battleButtonText;

  const image = isQuery ? '' : imageList[eventType];
  const imageTag = <img src={image}></img>

  return (
    <>
      <div className="message-window">
        <div>
          {text}<br></br> 
          {points !== 0 ? `Points: ${points}` : ''}
        </div>
        <div style={{height: '1em', width: '1em'}} >{imageTag}</div>
        <div style={{color: pointStaminaTextColor}}>Current Stamina: {currentStamina}</div>
        <div className="button-container">
        <button onClick={() => messageWindowClose(true, false)} style={{display: isQuery ? 'block' : 'none'}} autoFocus={true}>
            No, I'd better not...
        </button>
        <button onClick={() => messageWindowClose(isQuery ? false : true, isBattle)}>
          {buttonText}
        </button>
        </div>
      </div>
    </>
  )
};

export default MessageWindow