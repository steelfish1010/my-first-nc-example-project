const db = require("../db/connection");

exports.fetchArticleById = async (article_id) => {
  if (!parseInt(article_id)) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
  }
  const res = await db.query("SELECT * FROM articles WHERE article_id = $1", [
    article_id,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Invalid article_id" });
  } else {
    return res.rows[0];
  }
};
