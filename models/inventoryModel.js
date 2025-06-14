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

exports.insertClassification = async (classification_name) => {
  const sql = `
    INSERT INTO public.classification (classification_name)
    VALUES ($1)
  `;
  return pool.query(sql, [classification_name]);
};

exports.insertInventory = async (vehicle) => {
  const sql = `
    INSERT INTO public.inventory
      (classification_id, inv_make, inv_model, inv_year, inv_description,
       inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  `;
  const params = [
    vehicle.classification_id, vehicle.inv_make, vehicle.inv_model, vehicle.inv_year,
    vehicle.inv_description, vehicle.inv_image, vehicle.inv_thumbnail,
    vehicle.inv_price, vehicle.inv_miles, vehicle.inv_color
  ];
  return pool.query(sql, params);
};

async function getClassifications() {
  const sql = 'SELECT * FROM public.classification ORDER BY classification_name';
  return pool.query(sql);
}

module.exports = {
  getVehicleById,
  getVehiclesByClassification,
  getClassifications,
};