import express from 'express';
const usersRoutes = express.Router();
import queryDB from '../db/index.js';

let DB = [{name: 'Hapi', password: 'onstersmay'}, {name: 'Coco', password: 'jousamaoay'}];
let otherTable = {'Hapi': {}, 'Coco': {}};

function encrypt(str) {
  const first = str[0];
  const result = str.slice(1) + first + 'ay';
  return result;
};

function decrypt(str) {
    const end = str.slice(str.length - 3);
    const body = str.slice(0, str.length - 3);
    const result = end[0] + body;
    return result;
};

function checkPassword(enteredStr, dbStr) {
    const compare = decrypt(dbStr);
    if (enteredStr === compare) {
        return true;
    } else {
        return false;
    }
};

function preparePasswordForDB(str) {
    const encrypted = encrypt(str);
    return encrypted;
};

function confirmLogin(user, password) {
    const match = DB.find((savedUsers) => savedUsers.name === user);
    if (!match) {
        return false;
    }
    const passwordOk = checkPassword(password, match.password);
    if (passwordOk) return true;
    else return false;
};

function saveNewLogin(user, password) {
    const isMatch = DB.findIndex((savedUsers) => savedUsers.name === user);
    if (isMatch === -1) {
        DB.push({name: user, password: preparePasswordForDB(password)});
        return true;
    } else {
        return false;
    }
};

function findSavedData(user) {
    const data = otherTable[user];
    if (Object.keys(data).length > 0) {
        return data;
    } else {
        return null;
    }
};

function saveGameData(user, data) {
    otherTable[user] = {...data};
    return true;
};


usersRoutes.get('/getGame', async (req, res, next) => {
    try {
        const user = req.query.name;
        const userData = await queryDB('getSavedGame', [user]);
        res.status(200).set({ 'Content-Type': 'application/json' }).json(userData[0]);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.post('/saveGame', express.json(), async (req, res, next) => {
    try {
        const body = req.body;
        const success = await queryDB('saveGameData', body);
        if (success.command === 'UPDATE') {
            res.status(200).set({ 'Content-Type': 'application/json' }).json({result: 'game saved'});
        } else {
            res.status(200).set({ 'Content-Type': 'application/json' }).json({result: 'problem saving'});
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.delete('/deleteData', express.json(), async (req, res, next) => {
    const body = req.body;
    try {
        const success = await queryDB('deleteGameData', body.name);
        if (success.command === 'UPDATE') {
            res.status(200).set( { 'Content-Type': 'application/json' }).json('game deleted');
        } else {
            res.status(200).set( { 'Content-Type': 'application/json' }).json('problem deleting');
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.post('/create', express.json(), async (req, res, next) => {
    try {
        const newUser = req.body;
        const canSave =  await saveNewLogin(newUser.name, newUser.password);
        if (canSave) {
            res.status(200).set({ 'Content-Type': 'application/json' }).json('saved');
          } else {
            res.status(200).set({ 'Content-Type': 'application/json' }).json('already exists');
          }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.post('/login', express.json(), async (req, res, next) => {
    try {
        const user = req.body;
        const isUser = await confirmLogin(user.name, user.password);
        if (!isUser) {
            res.status(200).set({ 'Content-Type': 'application/json' }).json('not a user');
        } else {
            res.status(200).set({ 'Content-Type': 'application/json' }).json('success');
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.use('/', (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
      }
      console.error(err, err.stack, 'problem in user route')
      res.status(500).json('porbelm');
});

export default usersRoutes