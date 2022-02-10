const lodash = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

//get all users

router.get("/", async (req, res) => {
  const users = await User.find()
    .sort({ name: 1 })
    .select({ name: 1, email: 1 });
  res.send(users);
});

// get logged in user

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
//get user by Id
router.get("/:id", validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.send(user);
});

// create new user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user with that email already exists");
  user = new User(lodash.pick(req.body, ["name", "email", "password"]));

  // hash the password before saving to database
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // generate auth token for user
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["_id", "name", "email"]));
});

// login existing user

router.post("/login", async (req, res) => {
  const { error } = validateLoginInfo(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  //user.password already contains the hashing salt
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});

// update existing user

router.put("/me", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      password: password,
    },
    { new: true }
  );
  if (!user) return res.status(404).send("user for that id not found");
  res.send(user);
});

router.delete("/me", auth, async (req, res) => {
  const deletedUser = await User.findByIdAndRemove(req.user._id);
  res.send(deletedUser);
});

function validateLoginInfo(req) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(255).required().email(),
    password: Joi.string().min(10).max(255).required(),
  });
  return schema.validate(req);
}
module.exports = router;
