import './Die.css';
import { useMemo, useState } from 'react';

/** Creates the die face */
function Die(props: {dots: number, rollDie: Function, canRollDie: boolean}) {
    const { dots, rollDie, canRollDie } = props;

    const [dieRolling, setDieRolling] = useState(false);
    const dotClass = useMemo(() => {
        if (dieRolling === true) {
            return 'dot rolling-die';
        } else {
            return 'dot';
        }
    }, [dieRolling]);
    const dotColorIsGray = useMemo(() => {
        if (dieRolling === true) {
            return true;
        } else {
            return false;
        }
    }, [dieRolling]);
    

    const dotConfigs: Map<number, number[]> = new Map();
    dotConfigs.set(1, [4]);
    dotConfigs.set(2, [2, 6]);
    dotConfigs.set(3, [2, 4, 6]);
    dotConfigs.set(4, [0, 2, 6, 8]);
    dotConfigs.set(5, [0, 2, 4, 6, 8]);
    dotConfigs.set(6, [0, 2, 3, 5, 6, 8]);
    dotConfigs.set(10, [0, 1, 2, 3, 4, 5, 6, 7, 8]);

    const blackDotList = useMemo(() => {
      return dotConfigs.get(dots) ?? [10];
    }, [dots, dotConfigs]);


    const faceDots: JSX.Element[] = [];
    
            for (let i = 0; i < 9; i++) {
                let backGroundColor = 'inherit';
                if (blackDotList.includes(i)) {
                    backGroundColor = 'black';
                }
                faceDots.push(<div key={i} className={dotClass} style={{backgroundColor: dotColorIsGray ? 'gray' : backGroundColor}}></div>);
            }

    const [dieFaceClass, setDieFaceClass] = useState('die-face');

    function rolling() {
      setDieFaceClass('die-face rolling-die');
      setDieRolling(true);
      setTimeout(() => {
        rollDie(Math.ceil(Math.random() * 6));
        setDieFaceClass('die-face');
        setDieRolling(false);
      }, 1000);
    };

  return (
    <>
      <div className={dieFaceClass} style={{backgroundColor: canRollDie ? 'white' : 'gray'}} onClick={() => canRollDie ? rolling() : {}}>
        {faceDots}
      </div>
      <div style={{color: '#63c4e2', opacity: canRollDie ? 100 : 0}}>
        <b>Roll the die!</b>
      </div>
    </>
  )
}

export default Die