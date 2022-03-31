const { getTopics } = require("../controllers/topics.controller");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics).all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

topicsRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = topicsRouter;
