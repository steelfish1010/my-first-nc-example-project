const { getTopics } = require("../controllers/topics.controller");
const { getUsers } = require("../controllers/users.controller");

const apiRouter = require("express").Router();

apiRouter
  .get("/", (req, res) => {
    res.status(200).send({ msg: "All OK from API router" });
  })
  .get("/topics", getTopics);

apiRouter.get("/users", getUsers);

apiRouter.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = apiRouter;
