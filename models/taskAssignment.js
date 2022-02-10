const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = mongoose.Schema({
  taskTitle: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  taskDescription: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 400,
  },
  taskLocation: {
    type: String,
  },
});

const taskCreatorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
});

const offerSchema = mongoose.Schema({
  offerPrice: {
    type: Number,
  },
});

const taskerSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
      type: String
    } 
})

const taskAssignmentSchema = mongoose.Schema({
  taskCreator: {
    type: taskCreatorSchema,
    required: true,
  },
  task: {
    type: taskSchema,
    required: true,
  },
  offer: {
    type: offerSchema,
    required: true,
  },
  tasker:{
    type:taskerSchema
  }
});

const TaskAssignment = mongoose.model("TaskAssignment", taskAssignmentSchema);

function validateTaskAssignment(taskAssignment) {
  const schema = Joi.object({
    taskCreator: Joi.objectId(),
    taskId: Joi.objectId().required(),
    offerId: Joi.objectId().required(),
  });
  return schema.validate(taskAssignment);
}

module.exports.TaskAssignment = TaskAssignment;
module.exports.validateTaskAssignment = validateTaskAssignment;
