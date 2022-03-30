const db = require("../db/connection");

exports.fetchArticles = async () => {
  const { rows } = await db.query(`
  SELECT 
  articles.author,
      title,
      articles.article_id,
      topic,
      articles.created_at::DATE,
      articles.votes,
      COUNT(comment_id)::INTEGER AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
  `);
  return rows;
};

exports.fetchArticleById = async (article_id) => {
  if (!parseInt(article_id)) {
    return Promise.reject({ status: 400, msg: "article_id is not a number" });
  }
  const { rows } = await db.query(
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
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Invalid article_id" });
  } else {
    return rows[0];
  }
};

exports.fetchCommentsByArticleId = async (article_id) => {
  const { rows } = await db.query(
    `
  SELECT * FROM comments
  WHERE article_id = $1`,
    [article_id]
  );
  return rows;
};

exports.updateArticleById = async (body, article_id) => {
  const votes = parseInt(body.inc_votes);
  const { rows } = await db.query(
    `
  UPDATE articles
  SET 
  votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `,
    [votes, article_id]
  );
  return rows[0];
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
