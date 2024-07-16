import { highScoreListType } from '../appTypes';


function addScoreToList (list: highScoreListType, newEntry: [number, string], index: number) {
    const newList: highScoreListType = [];
    if (index === 0) {
        newList.push(newEntry, ...list);
        newList.pop();
        return newList;
    } else if (index === list.length - 1) {
        newList.push(...list);
        newList.pop();
        newList.push(newEntry);
        return newList;
    } else {
        const front = list.slice(0, index);
        const back = list.slice(index + 1);
        front.push(newEntry);
        const newList = [...front, ...back];
        return newList;
    }
};

function checkScoreAgainstList(list: highScoreListType, newEntry: [number, string]): number {
    const index = list.findIndex((el) => {
        if (el[0] > newEntry[0]) {
          return false;
        } else {
          return true;
        }
      });
      return index;
};

const highScoreCalculations = {
    addScoreToList,
    checkScoreAgainstList,
};

export default highScoreCalculations;