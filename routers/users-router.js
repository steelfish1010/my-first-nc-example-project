const { getUsers } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers).all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

usersRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = usersRouter;
