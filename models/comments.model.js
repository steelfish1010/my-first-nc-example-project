const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/helpers/utils");

exports.addCommentByArticleId = async (comment, article_id) => {
  const { username, body } = comment;
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "posted body is incomplete",
    });
  }
  const timestamp = Date.now();
  const { created_at } = convertTimestampToDate({ created_at: timestamp });
  const { rows } = await db.query(
    `
  INSERT INTO comments
  (author, body, article_id, votes, created_at)
  VALUES ($1,$2, $3, $4, $5)
  RETURNING *;
  `,
    [username, body, article_id, 0, created_at]
  );
  return rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "comment_id not found" });
  }
};

exports.updateCommentById = async (inc_votes, comment_id) => {
  if (!parseInt(comment_id)) {
    return Promise.reject({ status: 400, msg: "comment_id is not a number" });
  }
  const { rows } = await db.query(
    `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2 
  RETURNING *;`,
    [inc_votes, comment_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "comment_id not found" });
  }
  return rows[0];
};
