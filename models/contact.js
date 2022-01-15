const { Schema, model } = require("mongoose");

const contactSchema = Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("contact", contactSchema);

const Joi = require("joi");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  favorite: Joi.boolean(),
});

module.exports = { Contact, joiSchema };
