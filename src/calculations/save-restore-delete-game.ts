import { IgameSaveData, squareStyleAttributes, treasureTrapMap, treasureTrapTypes, squareStyleArray } from "../appTypes";

/** Used maps for board data to avoid forced stringifying of keys, but maps don't work well when transformed to JSON */
function mapToObject(map: squareStyleAttributes | treasureTrapMap) {
  const obj: Record<string, Array<any>> = {};
  map.forEach((el, ind) => {
    obj[`${ind}`] = [...el];
  });
  return obj;
};

/** For restoring JSON objects that represent board to maps */
function objectToMap(obj: Record<string, [treasureTrapTypes, number, string] | squareStyleArray>) {
  const map = new Map();
  Object.keys(obj).forEach((key) => {
    const numKey = parseInt(key);
    map.set(numKey, obj[key]);
  });
  return map;
};

const saveRestoreDeleteGame = {
  /** Saves game to local storage and optionally to DB */
  saveGame: async (data: IgameSaveData, points: number, stamina: number, name: string, autoSave: boolean) => {
        const objectifiedTreasureMap = mapToObject(data.treasuresAndTrapsData);
        const objectifiedIslandMap = mapToObject(data.chosenSquareData);
        const dataToSaveAsJson = { ...data, treasuresAndTrapsData: objectifiedTreasureMap, chosenSquareData: objectifiedIslandMap, currentScore: points, currentStamina: stamina };
        if (!autoSave) {
          return true;
        }
        localStorage.setItem(`savedGame-${name}`, JSON.stringify(dataToSaveAsJson));
        const body = JSON.stringify({name: name, game: dataToSaveAsJson});
        const request = new Request('/api/users/saveGame', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} });
        const success = await fetch(request)
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((e) => console.error(e));
      if (success.result === 'game saved') {
        return true;
      } else {
        window.alert('There was an issue saving. Try again.');
        return false;
      }
  },
  /** Restore game from local storage if there, and from DB if there, otherwise returns null */
  restoreGame: async (name: string): Promise<IgameSaveData | null> => {
    const localSaveData = localStorage.getItem(`savedGame-${name}`);
    const localSaveDataJS = localSaveData !== null ? JSON.parse(localSaveData) : null;
    if (localSaveDataJS !== null) {
      const modifiedLocalSaveData = {...localSaveDataJS, treasuresAndTrapsData: objectToMap(localSaveDataJS.treasuresAndTrapsData), chosenSquareData: objectToMap(localSaveDataJS.chosenSquareData)};
      return modifiedLocalSaveData;
    } else {
      const url = `/api/users/getGame?name=${name}`;
          const gameRequest = new Request(url, {method: 'GET'});
          const dbSaveData = await fetch(gameRequest)
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((e) => console.error(e));
          if (dbSaveData.game) {
            const modifiedDBSaveData = {...dbSaveData.game, treasuresAndTrapsData: objectToMap(dbSaveData.game.treasuresAndTrapsData), chosenSquareData: objectToMap(dbSaveData.game.chosenSquareData)};
            return modifiedDBSaveData;
          } else {
            return null;
          }
    }
  },
  /** Deletes saved game data from both local storage and DB */
  deleteGame: async (name: string) => {
    localStorage.removeItem(`savedGame-${name}`);
    const body = JSON.stringify({name: name});
    const request = new Request('/api/users/deleteData', { method: 'DELETE', body: body, headers: {'Content-Type': 'application/json'} });
    const deleted = await fetch(request)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => console.error(e));
    if (deleted === 'game deleted') {
      console.log('game deleted');
      return true;
    } else {
      console.log("game wasn't deleted.");
      return false;
    }
  },
};

export default saveRestoreDeleteGame