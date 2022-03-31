const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter
  .get("/", getArticles)
  .get("/:article_id", getArticleById)
  .get("/:article_id/comments", getCommentsByArticleId)
  .post("/:article_id/comments", postCommentByArticleId)
  .patch("/:article_id", patchArticleById)
  .all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

articlesRouter.use((err, req, res, next) => {
  next(err);
});
module.exports = articlesRouter;
