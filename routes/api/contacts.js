const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");

const { Contact, joiSchema } = require("../../model");

router.get("/", async (req, res, next) => {
  try {
    res.json(await Contact.find());
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
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

router.delete("/:contactId", async (req, res, next) => {
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

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    if (favorite === undefined) {
      throw new BadRequest("missing field favorite");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
