const express = require("express");
const router = express.Router();

const { User } = require("../../models");
const { joiSchema } = require("../../models/user");
const { BadRequest } = require("http-errors");

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    console.log(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    res.json({ message: "response" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
