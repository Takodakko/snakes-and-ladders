import express from 'express';
const highScoreRoutes = express.Router();

let dbList = [[100, 'Claude'], [90, 'Leonie'], [85, 'Lysithea'], [70, 'Lorenz'], [60, 'Ignatz'], [55, 'Raphael'], [10, 'Hilda'], [-10, 'Marianne']];
function dbSave(list) {
    if (Array.isArray(list)) {
        dbList = [...list];
        return dbList;
    } else {
        throw new Error('not right format');
    }
  };
function dbRetrieve() {
    return dbList;
}

highScoreRoutes.get('/', async (req, res, next) => {
    try {
      console.log('getting high scores...');
      // get from DB
      const list = await dbRetrieve();
      res.status(200).set({ 'Content-Type': 'application/json' }).json(list);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  highScoreRoutes.post('/', express.json(), async (req, res, next) => {
    try {
      const list = req.body;
      // save to DB
      const success = await dbSave(list);
      next();
    } catch (err) {
      console.error(err, '/highScores POST 1');
      next(err);
    }
  }, 
  (req, res, next) => {
    try {
        const newList = req.body;
        res.status(200).set({ 'Content-Type': 'application/json'}).json({newList: newList});
    } catch(err) {
        console.error(err, '/highScores POST 2');
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
