"use strict";
const router = require("express").Router();
const urlencoded = require("body-parser").urlencoded;
const { schemaMiddleware } = require("../middlewares/users");

// Middlewares
const middlewares = [
  // Form data parser
  urlencoded({ extended: true }),
  // Schema
  schemaMiddleware
]

// Endpoint definition
router.post("/", middlewares, (req, res) => {
  console.log(req.body)
  res.send("Hello world")
});

module.exports = router;