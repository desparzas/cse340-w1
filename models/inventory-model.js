const pool = require("../database");

async function getClassifications() {
  const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
  return data.rows; // Return only the rows array
}

module.exports = { getClassifications };