type highScoreListType = Array<[number, string]>;

function removeScore(list: highScoreListType) {
  return list;
};

function addScore(list: highScoreListType) {
  return list;
};

const highScoreCalcs = {
    removeScore,
    addScore,
};

export default highScoreCalcs
export type { highScoreListType }