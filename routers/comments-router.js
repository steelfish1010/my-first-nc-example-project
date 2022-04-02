const {
  deleteComment,
  patchCommentById,
} = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter
  .patch("/:comment_id", patchCommentById)
  .delete("/:comment_id", deleteComment)
  .all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
  });

commentsRouter.use((err, req, res, next) => {
  next(err);
});
module.exports = commentsRouter;
