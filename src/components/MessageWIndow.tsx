import './MessageWindow.css';
import { queryMessageType } from '../App';
import imageList from '../imageList';

function MessageWindow(props: {content: queryMessageType, messageWindowClose: Function, currentStamina: number, pointStaminaTextColor: 'black' | 'purple' | 'red'}) {
  const { content, messageWindowClose, currentStamina, pointStaminaTextColor } = props;
  
  const eventType = content[0];
  const isQuery = eventType === 'query';
  const points = content[1];
  const text = content[2];

  const buttonText = isQuery ? "Yeah, let's go for it!" : 'Ok';

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
        <button onClick={() => messageWindowClose(true)} style={{display: isQuery ? 'block' : 'none'}} autoFocus={true}>
            No, I'd better not...
        </button>
        <button onClick={() => messageWindowClose(isQuery ? false : true)}>
          {buttonText}
        </button>
        </div>
      </div>
    </>
  )
};

export default MessageWindow