const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");

const dotenv = require("dotenv");
dotenv.config();
const { SECRET_KEY } = process.env;

const { User } = require("../../models");
const { joiSchemaSignUp, joiSchemaSignIn } = require("../../models/user");
const authenticate = require("../../middlewars/authenticate");

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = joiSchemaSignUp.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  console.log(req.user);
  try {
    const { error } = joiSchemaSignIn.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized("Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new Unauthorized("Email or password is wrong");
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "3h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
