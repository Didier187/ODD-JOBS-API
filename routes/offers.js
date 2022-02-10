const { Offer, validateOffer} = require("../models/offer");
const { Task } = require("../models/task");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// get offers by task :id
// METHOD :GET
// URL: /api/offers/:id
// @params taskId
router.get("/:id", validateObjectId, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("could not find task with given id");
  res.send(task.offers);
});

//create offer using task id
// METHOD: POST
// URL: /api/offers/:id
// @params taskId
// NEEDS TO BE AUTHENTICATED AND VALIDE USER
router.post("/:id", [auth, validateObjectId], async (req, res) => {
  
  const { error } = validateOffer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("could not find task with given id");

  const offerCreated = new Offer({
    offerAuthor: req.user._id,
    offer: req.body.offer,
    offerPrice: req.body.offerPrice,
  });

  task.offers.push(offerCreated);
  await task.save();
  await offerCreated.save();
  res.send(task.offers);
});

//update offer
// METHOD: PUT
// URL: /api/offers/:id/offerId
// @params taskId AND offerId
// NEEDS TO BE AUTHENTICATED AND VALIDE USER
router.put("/:id/:offerId", [auth, validateObjectId], async (req, res) => {
  const { error } = validateOffer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("could not find task with given id");

  const offer = await task.offers.id(req.params.offerId);
  if (!offer) return res.status(404).send("offer for that id not found");
  if (offer.offerAuthor !== req.user._id)
    return res.status(401).send("can not edit offer unless you created it yourself");
  offer.offer = req.body.offer;
  await task.save();
  res.send(offer);
});

// delete offer
// METHOD: DELETE
// URL: /api/offers/:id/offerId
// @params taskId AND offerId
// NEEDS TO BE AUTHENTICATED AND VALIDE USER
router.delete("/:id/:offerId", [auth, validateObjectId], async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("could not find task with given id");

  const offer = await task.offers.id(req.params.offerId);
  if (!offer) return res.status(404).send("could not find offer with given id");

  if (offer.offerAuthor !== req.user._id)
    return res.status(401).send("can not delete offer unless you created it yourself");
  console.log(req.user._id, offer.offerAuthor)
  const deletedOffer = await Offer.findByIdAndRemove(req.params.offerId);

  offer.remove();
  task.save();
  res.send(deletedOffer);
});
module.exports = router;
