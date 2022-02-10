const express = require("express");
const router = express.Router();
const {
  Conversation,
  validateConversation,
} = require("../models/conversation");
const validateObjectId = require("../middleware/validateObjectId");

// create a conversation
// METHOD: POST
// URL: /api/conversations

router.post("/", async (req, res) => {
  const { error } = validateConversation(req.body);

  if (error) return res.status(404).send(error.details[0].message);
  const conversation = new Conversation({
    participants: [req.body.senderId, req.body.receiverId],
  });

  await conversation.save();

  res.send(conversation);
});

// get user's conversation
// METHOD: GET
// @params userId
// URL: /api/conversations/:userId

router.get("/:id", validateObjectId, async (req, res) => {
  const conversation = await Conversation.find({
    participants: { $in: [req.params.id] },
  });
  res.send(conversation);
});

module.exports = router;
