const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.model");

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  try {
    const comment = await updateCommentById(inc_votes, comment_id);
    res.send({ comment });
  } catch (err) {
    next(err);
  }
};
