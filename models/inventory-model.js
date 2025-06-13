const pool = require('../database/pool');

async function getVehicleById(inv_id) {
  const sql = `
    SELECT *
      FROM public.inventory
     WHERE inv_id = $1
  `;
  const { rows } = await pool.query(sql, [inv_id]);
  return rows[0];
}

async function getVehiclesByClassification(classification_name) {
  const sql = `
    SELECT i.*
    FROM inventory i
    JOIN classification c ON i.classification_id = c.classification_id
    WHERE LOWER(c.classification_name) = $1
    ORDER BY i.inv_make, i.inv_model
  `;
  const result = await pool.query(sql, [classification_name]);
  return result.rows;
}

module.exports = {
  getVehicleById,
  getVehiclesByClassification,
};