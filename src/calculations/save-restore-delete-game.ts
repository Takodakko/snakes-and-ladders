import { IgameSaveData, IdataToSaveAsJson, islandStyleArray, islandAttributes } from "../appTypes";
import { saveGameToDB, restoreGameFromDB, deleteGameFromDB } from "../api";

/** Used maps for board data to avoid forced stringifying of keys, but maps don't work well when transformed to JSON */
function mapToObject(map: islandAttributes) {
  const obj: Record<string, islandStyleArray> = {};
  map.forEach((el, ind) => {
    obj[`${ind}`] = [...el];
  });
  return obj;
};

/** For restoring JSON objects that represent board to maps */
function objectToMap(obj: Record<string, islandStyleArray>) {
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
        const objectifiedIslandMap = mapToObject(data.chosenIslandData);
        const dataToSaveAsJson: IdataToSaveAsJson = { ...data, chosenIslandData: objectifiedIslandMap, currentScore: points, currentStamina: stamina };
        localStorage.setItem(`savedGame-${name}`, JSON.stringify(dataToSaveAsJson));
        if (autoSave) {
          return true;
        }
        const success: Record<string, string> = await saveGameToDB(name, dataToSaveAsJson);
        if (success.result === 'game saved') {
          return true;
        } else {
          window.alert('There was an issue saving. Try again.');
          return false;
        }
  },
  /** Restore game from local storage if there, and from DB if there, otherwise returns null */
  restoreGame: async (name: string): Promise<IgameSaveData | null> => {
    console.log(name, 'name in restoreGame');
    const localSaveData = localStorage.getItem(`savedGame-${name}`);
    console.log(localSaveData, 'localSaveData')
    const localSaveDataJS = localSaveData !== null ? JSON.parse(localSaveData) : null;
    if (localSaveDataJS !== null) {
      const modifiedLocalSaveData = {...localSaveDataJS, chosenIslandData: objectToMap(localSaveDataJS.chosenIslandData)};
      return modifiedLocalSaveData;
    } else {
      console.log(name, 'name in restoreGame');
      const dbSaveData: {game: IdataToSaveAsJson} | null = await restoreGameFromDB(name);
          if (dbSaveData?.game) {
            const modifiedDBSaveData = {...dbSaveData.game, chosenIslandData: objectToMap(dbSaveData.game.chosenIslandData)};
            return modifiedDBSaveData;
          } else {
            return null;
          }
    }
  },
  /** Deletes saved game data from both local storage and DB */
  deleteGame: async (name: string) => {
    localStorage.removeItem(`savedGame-${name}`);
    const deleted = await deleteGameFromDB(name);
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