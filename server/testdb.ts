require('dotenv').config()
import {  Client  } from 'pg';

const client = new Client({
  connectionString: process.env.PG_URI
})

client.connect()
  .then(() => {
    console.log('RAW PG connected successfully!')
    return client.query('SELECT current_database()')
  })
  .then(res => {
    console.log('Database:', res.rows[0])
    client.end()
  })
  .catch(err => {
    console.error('RAW PG failed:', err.message)
    client.end()
  })