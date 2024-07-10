import { highScoreListType } from "../App";
import './HighScore.css';

function HighScore(props: {highScores: highScoreListType, showHighScores: boolean, newScoreIndex: number}) {
    const {newScoreIndex, highScores, showHighScores} = props;
    let index = 0;
    const list = highScores.map((item) => {
        index += 1;
        return (
          <li className={index - 1 === newScoreIndex ? 'new-score-pulse' : 'row'} key={index} style={{backgroundColor: index % 2 === 0 ? 'rgb(242, 184, 163)' : 'rgb(147, 240, 134)'}}>
            <span>
            <div>
                Score: <b>{item[0]}</b>
            </div>
            <div>
                Name: <b>{item[1]}</b>
            </div>
            </span>
          </li>
        )
    });

  return (
    <div className="high-score-list" style={{display: showHighScores ? 'block' : 'none'}}>
      <h1>
        High Scores List
      </h1>
      <ol>
        {list}
      </ol>

    </div>
  )
};

export default HighScore