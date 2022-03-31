const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/articles.model");

exports.getArticles = async (req, res, next) => {
  const { sort_by } = req.query;
  try {
    const articles = await fetchArticles(sort_by);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await fetchArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const dbQueries = [
      fetchCommentsByArticleId(article_id),
      fetchArticleById(article_id),
    ];
    const results = await Promise.all(dbQueries);
    const comments = results[0];
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { body } = req;
    const dbQueries = [
      updateArticleById(body, article_id),
      fetchArticleById(article_id),
    ];
    const results = await Promise.all(dbQueries);
    const updatedArticle = results[0];
    res.status(200).send({ updatedArticle });
  } catch (err) {
    next(err);
  }
};
