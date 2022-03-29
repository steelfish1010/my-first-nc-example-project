const { fetchArticleById, updateArticle } = require("../models/articles.model");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await fetchArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { body } = req;
    const dbQueries = [
      updateArticle(body, article_id),
      fetchArticleById(article_id),
    ];
    const results = await Promise.all(dbQueries);
    const updatedArticle = results[0];
    res.status(200).send({ updatedArticle });
  } catch (err) {
    next(err);
  }
};
