const pool = require("../database");

async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return data.rows; // Return only the rows array
}

async function getClassificationById(classification_id) {
  const data = await pool.query(
    "SELECT * FROM public.classification WHERE classification_id = $1 ORDER BY classification_name",
    [classification_id]
  );
  return data.rows[0];
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
  }
}

async function getVehicleById (id) {
    const query = 'SELECT * FROM inventory WHERE inv_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getClassifications, getClassificationById, getInventoryByClassificationId, getVehicleById };