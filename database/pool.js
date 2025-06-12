// ...existing pool setup...
const { Pool } = require('pg');
const pool = new Pool({
  // your connection config here
});

// Smoke-test query
pool.query('SELECT NOW()')
  .then(res => console.log('🟢 DB Time:', res.rows[0].now))
  .catch(err => console.error('🔴 DB Error:', err.stack));

module.exports = pool;