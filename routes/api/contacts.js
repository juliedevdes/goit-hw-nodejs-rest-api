const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");

const { Contact } = require("../../models");
const { joiSchema } = require("../../models/contact");
const authenticate = require("../../middlewars/authenticate");

router.get("/", authenticate, async (req, res, next) => {
  try {
    res.json(await Contact.find());
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authenticate, async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const foundContact = await Contact.findById(contactId);
    if (!foundContact) {
      throw new NotFound();
    }
    res.json(foundContact);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404;
    }
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  console.log(req.user);
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes("is required")) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete("/:contactId", authenticate, async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndRemove(contactId);
    if (!deletedContact) {
      throw new NotFound();
    }
    res.json({ message: `${deletedContact.name}'s contact deleted` });
  } catch (error) {
    next(error);
  }
});

const updateStatusContact = async function (contactId, body) {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

router.put("/:contactId", authenticate, async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await updateStatusContact(contactId, req.body);
    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", authenticate, async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    if (favorite === undefined) {
      throw new BadRequest("missing field favorite");
    }

    const updatedContact = await updateStatusContact(contactId, { favorite });
    if (!updatedContact) {
      throw new NotFound();
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
