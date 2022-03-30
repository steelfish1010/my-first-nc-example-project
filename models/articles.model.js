const db = require("../db/connection");

exports.fetchArticles = async () => {
  const res = await db.query(`
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
  return res.rows;
};

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
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Invalid article_id" });
  } else {
    return res.rows[0];
  }
};

exports.fetchCommentsByArticleId = async (article_id) => {
  const res = await db.query(
    `
  SELECT * FROM comments
  WHERE article_id = $1`,
    [article_id]
  );
  return res.rows;
};

exports.updateArticleById = async (body, article_id) => {
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
