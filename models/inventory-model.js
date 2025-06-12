const pool = require('../database/your-pg-pool'); // Update with your actual pool file

async function getVehicleById(inv_id) {
  const sql = `
    SELECT *
      FROM public.inventory
     WHERE inv_id = $1
  `;
  const { rows } = await pool.query(sql, [inv_id]);
  return rows[0];
}

module.exports = {
  getVehicleById,
};