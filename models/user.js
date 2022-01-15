const { Schema, model } = require("mongoose");

const emailRegexp = /^\w+([.-]?\w+)+@\w+([.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;

const userSchema = Schema(
  {
    name: { type: String, default: "User Name" },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlenght: 6,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

const Joi = require("joi");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

module.exports = { User, joiSchema };
