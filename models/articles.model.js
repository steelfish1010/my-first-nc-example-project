const db = require("../db/connection");
const format = require("pg-format");

exports.fetchArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic,
  author
) => {
  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  order = order.toUpperCase();
  const validOrder = ["ASC", "DESC"];

  if (topic) {
    const topics = await db.query(`SELECT slug FROM topics;`);
    const validTopics = topics.rows.map((topic) => topic.slug);
    if (!validTopics.includes(topic)) {
      return Promise.reject({ status: 400, msg: "Topic does not exist" });
    }
  }
  if (author) {
    const authors = await db.query(`SELECT username FROM users`);
    const validAuthors = authors.rows.map((author) => author.username);
    if (!validAuthors.includes(author)) {
      return Promise.reject({ status: 400, msg: "Author does not exist" });
    }
  }

  if (!validColumns.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let queryStr = `
  SELECT 
  articles.author,
      title,
      articles.article_id,
      topic,
      articles.created_at::DATE,
      articles.votes,
      COUNT(comment_id)::INTEGER AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  let queryValues = [];
  let queryCount = 0;
  if (topic) {
    queryCount++;
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  if (author) {
    queryCount++;
    if (queryCount === 1) {
      queryStr += ` WHERE articles.author = $1`;
    } else {
      queryStr += ` AND articles.author = $${queryCount}`;
    }
    queryValues.push(author);
  }

  queryStr += ` 
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};
  `;

  const { rows } = await db.query(queryStr, queryValues);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No articles found with that query",
    });
  }
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

exports.addArticle = async (article) => {
  const { author, body, title, topic } = article;
  console.log(article, "<< article in model");
  const { rows } = await db.query(
    `
  INSERT INTO articles
  (author, title, body, topic)
  VALUES ($1, $2,$3,$4)
  RETURNING *;
  `,
    [author, title, body, topic]
  );
  const { article_id } = rows[0];

  return await this.fetchArticleById(article_id);
};
