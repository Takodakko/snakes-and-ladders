import express from 'express';
const usersRoutes = express.Router();
import queryDB from '../db/index.js';

/** Placeholder fake encryption */
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


usersRoutes.get('/getGame', async (req, res, next) => {
    try {
        const user = req.query.name;
        console.log(user);
        const userData = await queryDB('getSavedGame', [user]);
        console.log(userData.rows[0], 'userData.rows[0]');
        res.status(200).set({ 'Content-Type': 'application/json' }).json(userData.rows[0]);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.post('/saveGame', express.json(), async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body, 'body in user saveGame')
        const success = await queryDB('saveGameData', [body.game, body.name]);
        console.log(success, 'success in users save game route')
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
        const success = await queryDB('deleteGameData', [body.name]);
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
        const alreadyExists = await queryDB('checkForUser', [newUser.name]);
        if (alreadyExists.rows.length > 0) {
            res.status(200).set({ 'Content-Type': 'application/json' }).json('already exists');
        } else {
            const canSave =  await queryDB('addUser', [newUser.name, encrypt(newUser.password)]);
            if (canSave.command === 'INSERT') {
                res.status(200).set({ 'Content-Type': 'application/json' }).json('saved');
              } else {
                res.status(500).set({ 'Content-Type': 'application/json' }).json('not saved');
              }
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

usersRoutes.post('/login', express.json(), async (req, res, next) => {
    try {
        const user = req.body;
        const pword = encrypt(user.password);
        const isUser = await queryDB('login', [user.name, pword]);
        if (isUser.rows.length === 0) {
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