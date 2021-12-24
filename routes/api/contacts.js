const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("../../model");

router.get("/", async (req, res, next) => {
  res.json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const { url } = require(req);
  res.json(await getContactById(url));
});

router.post("/", async (req, res, next) => {
  res.json(await addContact(req));
});

router.delete("/:contactId", async (req, res, next) => {
  res.json(await removeContact(req));
});

router.patch("/:contactId", async (req, res, next) => {
  res.json({ message: "patch" });
});

module.exports = router;
