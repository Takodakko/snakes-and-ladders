
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: `postgres://${process.env.PG_USER}:${process.env.PW}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`,
});
await pool.connect();

const queries = {
    'getAll': async () => {
        try {
            const result = await pool.query('SELECT * FROM high_scores ORDER BY score DESC LIMIT 8;');
            return result.rows;
        } catch(err) {
            console.error(err);
        }
    },
    'postNewEntry': async (entry) => {
        try {
            const result = await pool.query('INSERT INTO high_scores (name, score) VALUES ($1, $2);', entry);
            return result;
        } catch(err) {
            console.error(err);
        }
    },
    'getSavedGame': async (name) => {
        try {
            const key = await pool.query('SELECT * FROM users WHERE name = $1;', name);
            const result = await pool.query('SELECT data FROM saved_game INNER JOIN users ON saved_game.id = $1;', [key.rows[0].fkey]);
            return result.rows[0];
        } catch(err) {
            console.error(err);
        }
    },
}


async function queryDB(key, params) {
    
    const action = await queries[key](params);
    
    return action;
};

//await pool.end();
 
export default queryDB