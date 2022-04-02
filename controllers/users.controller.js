const { send } = require("express/lib/response");
const { fetchUsers, fetchUserByUsername } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    res.send({ user });
  } catch (err) {
    next(err);
  }
};
