const db = require("../db/connection");

exports.fetchArticleById = async (article_id) => {
  if (!parseInt(article_id)) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
  }
  const res = await db.query(
    `
  SELECT 
  articles.author,
      title,
      articles.article_id,
      articles.body,
      topic,
      articles.created_at,
      articles.votes,
      COUNT(comment_id)::INTEGER AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
  `,
    [article_id]
  );
  console.log(res.rows, "<-- res.rows in model");
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Invalid article_id" });
  } else {
    return res.rows[0];
  }
};

exports.updateArticle = async (body, article_id) => {
  const votes = parseInt(body.inc_votes);
  const res = await db.query(
    `
  UPDATE articles
  SET 
  votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `,
    [votes, article_id]
  );
  return res.rows[0];
};

exports.addCommentByArticleId = async (comment, article_id) => {
  const { username, body } = comment;
  const { rows } = await db.query(
    `
INSERT INTO comments
(username, body)
VALUES ($1,$2)
RETURNING *;
`,
    [username, body]
  );
  return rows[0];
};
