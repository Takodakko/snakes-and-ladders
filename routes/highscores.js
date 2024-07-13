import express from 'express';
const highScoreRoutes = express.Router();
import queryDB from '../db/index.js';

//let dbList = [[100, 'Claude'], [90, 'Leonie'], [85, 'Lysithea'], [70, 'Lorenz'], [60, 'Ignatz'], [55, 'Raphael'], [10, 'Hilda'], [-10, 'Marianne']];

highScoreRoutes.get('/', async (req, res, next) => {
    try {
      const list = await queryDB('getAll');
      res.status(200).set({ 'Content-Type': 'application/json' }).json(list);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  highScoreRoutes.post('/', express.json(), async (req, res, next) => {
    try {
      const entry = req.body;
      const success = await queryDB('postNewEntry', [entry.name, entry.score]);
      if (success.command === 'INSERT') {
        res.status(200).set({ 'Content-Type': 'application/json'}).json({entry: entry});
      } else {
        res.status(500).set({ 'Content-Type': 'application/json'}).json({entry: 'fail'});
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

highScoreRoutes.use('/', (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
      }
      console.error(err, err.stack, 'problem in high score route');
      res.status(500).json('porbelm');
});
  

  export default highScoreRoutes
