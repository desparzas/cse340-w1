const pool = require("../database/");

async function addReview(inv_id, account_id, review_text, rating) {
  try {
    const sql = "INSERT INTO reviews (inv_id, account_id, review_text, rating) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(sql, [inv_id, account_id, review_text, rating]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getReviewsByVehicle(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM reviews r 
      JOIN account a ON r.account_id = a.account_id 
      WHERE r.inv_id = $1 
      ORDER BY r.review_date DESC`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { addReview, getReviewsByVehicle };