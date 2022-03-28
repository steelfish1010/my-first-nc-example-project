const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((res) => {
      return res.rows[0];
    });
};

// Responds with:

// an article object, which should have the following properties:

// author which is the username from the users table
// title
// article_id
// body
// topic
// created_at
// votes
