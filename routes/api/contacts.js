const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const Joi = require("joi");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
});

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model");

router.get("/", async (req, res, next) => {
  try {
    res.json(await listContacts());
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const foundContact = await getContactById(contactId);
    if (!foundContact) {
      throw new NotFound();
    }
    res.json(foundContact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      throw new NotFound();
    }
    res.json({ message: `${deletedContact.name}'s contact deleted` });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const updatedContact = await updateContact(contactId, req.body);
    if (updateContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
