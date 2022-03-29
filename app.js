const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();
const apiRouter = require("./routers/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", () => {
  res.status(404).send({ msg: "Path not found" });
});

// PSQL errors
app.use((err, req, res, next) => {
  const badReqCodes = ["22P02"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "invalid request" });
  } else {
    next(err);
  }
});

//  custom error messages
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// all errors not handled elsewhere
app.use((err, req, res, next) => {
  console.log(err, "<-- server error");
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
