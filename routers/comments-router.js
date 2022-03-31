const commentsRouter = require("express").Router();

commentsRouter.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

commentsRouter.use((err, req, res, next) => {
  next(err);
});
module.exports = commentsRouter;
