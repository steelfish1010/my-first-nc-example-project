const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addArticle,
} = require("../models/articles.model");
const { addCommentByArticleId } = require("../models/comments.model");

exports.getArticles = async (req, res, next) => {
  let { sort_by, order, topic, author } = req.query;
  try {
    const articles = await fetchArticles(sort_by, order, topic, author);
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
  const { article_id } = req.params;
  try {
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
  const { article_id } = req.params;
  const { body } = req;
  try {
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

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  try {
    await fetchArticleById(article_id);
    const comment = await addCommentByArticleId(body, article_id);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const { body } = req;
  try {
    const article = await addArticle(body);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};
