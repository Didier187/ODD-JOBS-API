const express = require("express");
const tasks = require("../routes/tasks");
const users = require("../routes/users");
const offers = require("../routes/offers");
const taskAssignments = require("../routes/taskAssignments");
const conversations = require("../routes/conversations");
const messages = require("../routes/messages");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/tasks", tasks);
  app.use("/api/users", users);
  app.use("/api/offers", offers);
  app.use("/api/taskAssignments", taskAssignments);
  app.use("/api/conversations", conversations);
  app.use("/api/messages", messages);
};
