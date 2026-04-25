const axios = require('axios');
const { Client } = require('pg');

async function createAdmin() {
  try {
    // 1. Signup
    const signupData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123'
    };
    
    console.log('Signing up user...');
    await axios.post('http://localhost:3000/api/auth/signup', signupData).catch(err => {
        if(err.response?.status !== 409) throw err;
        console.log('User already exists, proceeding to update role.');
    });

    // 2. Update role to ROLE_ADMIN using pg
    console.log('Updating role to ROLE_ADMIN...');
    const client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '0000',
      database: 'isids26'
    });
    
    await client.connect();
    await client.query("UPDATE \"user\" SET role = 'admin' WHERE email = 'admin@example.com'");
    await client.end();
    
    console.log('Admin user ready! email: admin@example.com, password: password123');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createAdmin();
