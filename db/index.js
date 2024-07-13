
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: `postgres://${process.env.PG_USER}:${process.env.PW}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`,
});
await pool.connect();

const queries = {
    'getAll': 'SELECT * FROM high_scores ORDER BY score DESC LIMIT 8;',
    'postNewEntry': 'INSERT INTO high_scores (name, score) VALUES ($1, $2);',
    'getSavedGame': 'SELECT game FROM users WHERE name = $1;',
    'saveGameData': 'UPDATE users SET game = $1 WHERE name = $2;',
    'deleteGameData': 'UPDATE users SET game = null WHERE name = $1;',
    'login': 'SELECT * FROM users WHERE name = $1 AND password = $2;',
    'checkForUser': 'SELECT * FROM users WHERE name = $1;',
    'addUser': 'INSERT INTO users (name, password) VALUES ($1, $2);',
};

/** DB Tables users & high_scores
 * users -> id serial not null, name text not null, password text not null, game json
 * high_scores -> id serial not null, name text not null, score int not null
  */
async function queryDB(key, params) {
    try {
        const result = await pool.query(queries[key], params);
        return result;
    } catch(err) {
        console.error(err);
    }
};

//await pool.end();
 
export default queryDB
