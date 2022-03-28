const res = require("express/lib/response");
const { sendTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  sendTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};
