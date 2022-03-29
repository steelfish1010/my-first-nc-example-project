const { getArticleById } = require("../controllers/articles.controller");
const { getTopics } = require("../controllers/topics.controller");

const apiRouter = require("express").Router();

apiRouter
  .get("/", (req, res) => {
    res.status(200).send({ msg: "All OK from API router" });
  })
  .get("/topics", getTopics)
  .get("/articles/:article_id", getArticleById)
  .all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

module.exports = apiRouter;
