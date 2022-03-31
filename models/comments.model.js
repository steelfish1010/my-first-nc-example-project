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
  if (!parseInt(comment_id)) {
    return Promise.reject({ status: 400, msg: "comment_id is not a number" });
  }
  const { rows } = await db.query(`SELECT comment_id FROM comments;`);
  const validCommentIds = rows.map((id) => id.comment_id.toString());
  if (!validCommentIds.includes(comment_id)) {
    return Promise.reject({ status: 404, msg: "comment_id does not exist" });
  } else {
    await db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
  }
};
