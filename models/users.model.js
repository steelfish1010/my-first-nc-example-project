const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows } = await db.query("SELECT username FROM users");
  return rows;
};

exports.fetchUserByUsername = async (username) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Username not found" });
  }
  return rows[0];
};
