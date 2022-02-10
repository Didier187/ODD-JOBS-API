const express = require("express");
const {
  TaskAssignment,
  validateTaskAssignment,
} = require("../models/taskAssignment");
const { User } = require("../models/user");
const { Offer } = require("../models/offer");
const { Task } = require("../models/task");
const auth = require("../middleware/auth");
const router = express.Router();

// get all available taskAssignments
// TODO delete before production
// METHOD: GET
// URL: /api/taskAssignments
router.get("/", async (req, res) => {
  const taskAssignements = await TaskAssignment.find();
  res.status(200).send(taskAssignements);
});

//get task assignments for a user
// METHOD: GET
// URL: /api/taskAssignments/me
// NEEDS TO BE AUTHENTICATED  and SIGNED IN

router.get("/me", auth, async (req, res) => {
  const taskAssignments = await TaskAssignment.find({
    "taskCreator._id": { $eq: req.user._id },
  });
  if (!taskAssignments) return res.status(404).send("no task assignment found");
  res.send(taskAssignments);
});

// create a task taskAssignment
// METHOD: POST
// URL: /api/taskAssignments
// NEEDS TO BE AUTHENTICATED  and SIGNED IN
// @req-body: taskId,offerId
router.post("/", auth, async (req, res) => {
  const { error } = validateTaskAssignment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findById(req.body.taskId);
  if (!task) return res.status(404).send("can not find that task");

  if (req.user._id !== task.taskAuthor)
    return res.status(403).send("unauthorised operation");

  if (task.assigned) return res.status(406).send("task already assigned");

  const taskCreator = await User.findById(task.taskAuthor);
  if (!taskCreator)
    return res.status(404).send("task creator no longer exists");

  const offer = await Offer.findById(req.body.offerId);
  if (!offer) return res.status(404).send("can not find that offer");

  const tasker = await User.findById(offer.offerAuthor);
  if (!tasker) return res.status(404).send("Offer you selected does not exist");

  let taskAssignment = new TaskAssignment({
    taskCreator: {
      _id: taskCreator._id,
      name: taskCreator.name,
      email: taskCreator.email,
    },
    task: {
      _id: task._id,
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      taskLocation: task.taskLocation,
    },
    offer: {
      _id: offer._id,
      offerPrice: offer.offerPrice,
    },
    tasker: {
      _id: offer.offerAuthor,
      name: tasker.name,
      email: tasker.email,
    },
  });
  taskAssignment = await taskAssignment.save();
  task.assigned = true;
  await task.save();
  res.send(taskAssignment);
});

module.exports = router;
