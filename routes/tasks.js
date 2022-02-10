const express = require("express");
const router = express.Router();
const { Task, validateTask } = require("../models/task");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");

// get all tasks without filters
// METHOD :GET
// URL: /api/tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ budget: 1 });
  res.send(tasks);
});

// create a task
// METHOD: POST
// URL: /api/tasks
// REQUIRED: title, budget, description, category, status, userId
// need to be authenticated
router.post("/", auth, async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const task = new Task({
    author: req.user._id,
    title: req.body.title,
    description: req.body.description,
    remote: req.body.remote,
    location: req.body.location,
    dueDate: req.body.dueDate,
    budget: req.body.budget,
    category: req.body.category,
  });
  await task.save();
  res.send(task);
});

// update a task by id
// METHOD: PUT
// URL: /api/tasks/:id
// REQUIRED: title, budget, description, category, userId
// need to be authenticated
// optional: location, dueDate (if remote is false) status
router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findOne({
    _id: req.params.id,
    taskAuthor: req.user._id,
  });
  if (!task)
    return res.status(404).send("you can only update what you created");

  await task.updateOne({
    title: req.body.title,
    description: req.body.description,
    remote: req.body.remote,
    location: req.body.location,
    dueDate: req.body.dueDate,
    budget: req.body.budget,
    assigned: req.body.assigned,
    category: req.body.category,
  });


  res.send(task);
});

//delete task by id
// METHOD: DELETE
// URL: /api/tasks/:id
// REQUIRED: taskId
// need to be authenticated
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    author: req.user._id,
  });
  if (!task)
    return res.status(404).send("task not found + can only delete what you created");
  await task.delete(req.params.id);

  res.send(task);
});
module.exports = router;
