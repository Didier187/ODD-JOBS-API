const mongoose = require("mongoose");
const Joi = require("joi");

const offerSchema = mongoose.Schema({
  offerAuthor: String,
  offer: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
    lowercase: true,
  },
  offerPrice: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Offer = mongoose.model("Offer", offerSchema);

function validateOffer(offer) {
  const schema = Joi.object({
    offerAuthor: Joi.objectId(),
    offer: Joi.string().required().min(5).max(200).lowercase(),
    offerPrice: Joi.number(),
    date: Joi.date(),
  });
  return schema.validate(offer);
}

(module.exports.Offer = Offer),
  (module.exports.validateOffer = validateOffer),
  (module.exports.offerSchema = offerSchema);
