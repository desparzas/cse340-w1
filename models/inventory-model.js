const pool = require("../database");

async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return data.rows; // Return only the rows array
}

async function getClassificationsByName(classification_name) {
  const data = await pool.query(
    "SELECT * FROM public.classification WHERE classification_name = $1",
    [classification_name]
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

const insertInventory = async ({
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_price,
  inv_color,
  inv_miles,
  inv_image = "/images/vehicles/no-image.png",
  inv_thumbnail = "/images/vehicles/no-image-tn.png",
}) => {
  const sql = `
      INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_color, inv_miles, inv_image, inv_thumbnail)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING inv_id
  `;
  const values = [
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_color,
    inv_miles,
    inv_image,
    inv_thumbnail,
  ];

  const result = await pool.query(sql, values);
  const inv_id = result.rows[0].inv_id; // Get the generated inv_id

  return inv_id; // Return the generated inv_id
};

const insertClassification = async (classification_name) => {
  const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
  `;

  return await pool.query(sql, [classification_name]);
};

async function getVehicleById(id) {
  const query = "SELECT * FROM inventory WHERE inv_id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = {
  getClassifications,
  getClassificationById,
  getInventoryByClassificationId,
  getVehicleById,
  insertInventory,
  insertClassification,
  getClassificationsByName,
};
