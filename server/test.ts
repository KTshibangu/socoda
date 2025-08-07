import { pool } from './db.ts';

console.log('DB URL:', process.env.DATABASE_URL);

async function testDB() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to DB at:', res.rows[0].now);
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

testDB();