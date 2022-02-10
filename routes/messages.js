const express = require("express");
const router = express.Router();
const {Message, validateMessage} = require('../models/message ')
const validateObjectId = require("../middleware/validateObjectId");

// create a message 
// METHOD: POST
// URL: /api/messages

router.post('/', async (req, res) => {
    const {error} = validateMessage(req.body)
    if(error) return res.send(error.details[0].message)
    const message = new Message({
        conversationId: req.body.conversationId,
        sender: req.body.sender,
        text: req.body.text}
    )
    await message.save();
    res.send(message);
})

// METHOD: GET
// @params conversationId
// URL: /api/messages/:conversationId
router.get('/:id', validateObjectId, async (req, res) => {
    const messages = await Message.find({converstationId: req.params.id})
    res.send(messages);
})



module.exports = router;