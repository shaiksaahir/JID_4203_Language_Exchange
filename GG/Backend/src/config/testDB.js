// a test to make sure that connection to mysql was stable

const mysql = require('mysql2/promise'); // uses the promise package in mysql2 library to access database

const testDB = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Update with your actual password -- may be 'null' for some
    database: 'languageexchangematchmaker'
  });

  try {
    // Query to fetch user names
    const [rows, fields] = await connection.execute('SELECT firstName, lastName FROM UserAccount'); // fetching the same data as FriendSearch
    
    // Formatted the output to list each user's name in terminal
    console.log('User Names:');
    rows.forEach(row => {
      console.log(`${row.firstName} ${row.lastName}`);
    });
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await connection.end();
  }
};

testDB();