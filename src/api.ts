import { dbHighScores, IdataToSaveAsJson } from './appTypes';

export async function loginConfirmWithDB(name: string, pword: string): Promise<string> {
    const body = JSON.stringify({name: name, password: pword});
    const request = new Request('/api/users/login', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} });
    const loggedIn: Promise<string> = await fetch(request)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => console.error(e));
    return loggedIn;
};

export async function createNewUserInDB(name: string, pword: string): Promise<string> {
    const newUser = JSON.stringify({ name: name, password: pword });
      const request = new Request('/api/users/create', {method: 'POST', body: newUser, headers: {'Content-Type': 'application/json'} });
      const wasCreated = await fetch(request)
      .then((res) => res.json())
      .then((data) => {
        if (data === 'saved') {
          return data;
        } else {
          return 'not saved'
        }
      })
      .catch((e) => console.error(e));
      return wasCreated;
};

export async function getAllHighScoresFromDB(): Promise<dbHighScores[] | null> {
    const newScores = await fetch('/api/highScores', {method: 'GET'})
    .then((res) => {
      const data = res.json();
      return data;
    })
    .then((jdata) => {
      if (!jdata) {
        return null;
      } else {
        return jdata;
      }
    })
    .catch((e) => {
      console.error(e, 'error');
      return null;
    });
    return newScores;
};

export async function addNewHighScoreToDB(name: string, score: number): Promise<Record<string, string>> {
    const body = JSON.stringify({name: name, score: score});
    const request = new Request('/api/highScores', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} })
    const result: Record<string, string> = await fetch(request)
    .then((res) => res.json())
    .then((data) => {
      if (data.entry === 'fail') {
        console.error('problem saving to DB');
        return data;
      } else {
        console.log('high score added to DB');
        return data;
      }
    })
    .catch((e) => console.error(e));
    return result;
};

export async function saveGameToDB(name: string, dataToSaveAsJson: IdataToSaveAsJson) {
    const body = JSON.stringify({name: name, game: dataToSaveAsJson});
    const request = new Request('/api/users/saveGame', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} });
    const success = await fetch(request)
    .then((res) => res.json())
    .then((data) => {
        return data;
    })
    .catch((e) => console.error(e));
    return success;
};

export async function restoreGameFromDB(name: string): Promise<{game: IdataToSaveAsJson} | null> {
    const url = `/api/users/getGame?name=${name}`;
    const gameRequest = new Request(url, {method: 'GET'});
    const dbSaveData = await fetch(gameRequest)
    .then((res) => res.json())
    .then((data) => {
        return data;
    })
    .catch((e) => console.error(e));
    return dbSaveData;
};

export async function deleteGameFromDB(name: string) {
    const body = JSON.stringify({name: name});
    const request = new Request('/api/users/deleteData', { method: 'DELETE', body: body, headers: {'Content-Type': 'application/json'} });
    const deleted: string = await fetch(request)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => console.error(e));
    return deleted;
};