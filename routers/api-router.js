const {
  getArticleById,
  patchArticle,
} = require("../controllers/articles.controller");
const { getTopics } = require("../controllers/topics.controller");

const apiRouter = require("express").Router();

apiRouter
  .get("/", (req, res) => {
    res.status(200).send({ msg: "All OK from API router" });
  })
  .get("/topics", getTopics)
  .get("/articles/:article_id", getArticleById)
  .patch("/articles/:article_id", patchArticle)
  .all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

apiRouter.use((err, req, res, next) => {
  next(err);
});
module.exports = apiRouter;
