const pool = require("../database");

async function getAccountById(accountId) {
  const data = await pool.query(
    "SELECT * FROM public.account WHERE account_id = $1",
    [accountId]
  );
  return data.rows[0]; // Return only the first element of the rows array
}

module.exports = { getAccountById };
