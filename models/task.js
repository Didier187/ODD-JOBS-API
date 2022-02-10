const mongoose = require("mongoose");
const Joi = require("joi");
const { offerSchema } = require("./offer");

const taskSchema = mongoose.Schema({
  author: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 400,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  budget: {
    type: Number,
    required: true,
    min: 5,
  },
  offers: [offerSchema],
  assigned: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "open",
  },
  category: {
    type: String,
    required: true,
  },
});
const Task = mongoose.model("Task", taskSchema);

function validateTask(task) {
  const schema = Joi.object({
    author: Joi.objectId(),
    title: Joi.string().min(10).max(100).required(),
    description: Joi.string().min(20).max(400).required(),
    remote: Joi.boolean().required(),
    location: Joi.string(),
    dueDate: Joi.date(),
    budget: Joi.number().min(5),
    offers: Joi.array(),
    assigned: Joi.boolean(),
    status: Joi.string(),
    category: Joi.string().required(),
  });
  return schema.validate(task);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;
module.exports.taskSchema = taskSchema;
