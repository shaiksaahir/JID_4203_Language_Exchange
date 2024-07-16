// get the client
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodejsbasic',
  password: null
})

export default pool;
