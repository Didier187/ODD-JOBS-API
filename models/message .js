const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = mongoose.Schema({
  conversationId:{
    type: String,
    required: true
  },
  sender:{
    type: String,
    required: true,
  },
  text:{
    type: String,
    maxlength: 355,
    required: true
  }
});

const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
  const schema = Joi.object({
    conversationId: Joi.objectId().required(),
    sender:Joi.objectId().required(),
    text:Joi.string().required(),
  });
  return schema.validate(message);
}

module.exports.messageSchema = messageSchema;
module.exports.validateMessage = validateMessage;
module.exports.Message = Message;