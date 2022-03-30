const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/articles.controller");
const { getTopics } = require("../controllers/topics.controller");
const { getUsers } = require("../controllers/users.controller");

const apiRouter = require("express").Router();

apiRouter
  .get("/", (req, res) => {
    res.status(200).send({ msg: "All OK from API router" });
  })
  .get("/topics", getTopics)
  .get("/articles", getArticles)
  .get("/articles/:article_id", getArticleById)
  .get("/articles/:article_id/comments", getCommentsByArticleId)
  .post("/articles/:article_id/comments", postCommentByArticleId)
  .patch("/articles/:article_id", patchArticleById)
  .get("/users", getUsers)
  .all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

apiRouter.use((err, req, res, next) => {
  next(err);
});
module.exports = apiRouter;
