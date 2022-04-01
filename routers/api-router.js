const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/articles.controller");
const { getTopics } = require("../controllers/topics.controller");
const { getUsers } = require("../controllers/users.controller");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter
  .use("/topics", topicsRouter)
  .use("/articles", articlesRouter)
  .use("/users", usersRouter)
  .use("/comments", commentsRouter);

apiRouter
  .get("/", (req, res) => {
    res.status(200).send({ msg: "All OK from API router" });
  })
  .all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

apiRouter.use((err, req, res, next) => {
  next(err);
});
module.exports = apiRouter;
