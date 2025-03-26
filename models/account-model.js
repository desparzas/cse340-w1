const pool = require("../database");

async function getAccountById(accountId) {
  const data = await pool.query(
    "SELECT * FROM public.account WHERE account_id = $1",
    [accountId]
  );
  return data.rows[0]; // Return only the first element of the rows array
}

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *
    `;
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { getAccountById, registerAccount };
