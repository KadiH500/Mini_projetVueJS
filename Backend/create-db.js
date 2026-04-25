const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '0000',
  database: 'postgres'
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    await client.query('CREATE DATABASE isids26');
    console.log('Database isids26 created');
  } catch (err) {
    if (err.code === '42P04') {
        console.log('Database already exists');
    } else {
        console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

run();
