const express = require("express");
const res = require("express/lib/response");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const apiRouter = require("./routers/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", () => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// app.use((err, req, res, next) => {
//   console.log(err, "<-- server error");
//   res.status(500).send({ msg: "Internal server error" });
// });

module.exports = app;
