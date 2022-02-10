const mongoose = require("mongoose");
const Joi = require("joi");

const conversationSchema = mongoose.Schema({
  participants: {
    type: Array,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

function validateConversation(conversation) {
  const schema = Joi.object({
    senderId: Joi.objectId().required(),
    receiverId: Joi.objectId().required(),
  });
  return schema.validate(conversation);
}

module.exports.conversationSchema = conversationSchema;
module.exports.validateConversation = validateConversation;
module.exports.Conversation = Conversation;
