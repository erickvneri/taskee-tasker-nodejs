"use strict";
const logger = require("../logger");
const router = require("express").Router();
const urlencoded = require("body-parser").urlencoded;
const{ Response, HttpError } = require("../util");
const { schemaMiddleware } = require("../middlewares/users");
const { createUserService } = require("../services/users");

// Middlewares
const middlewares = [
  // Form data parser
  urlencoded({ extended: true }),
  // Schema
  schemaMiddleware
]

// Endpoint definition
router.post("/", middlewares, async (req, res) => {
  const{ username, password } = req.body;

  let user = null;
  let result = null;
  try {
    user = await createUserService(username, password);

    // This may happen if the database
    // didn't fail to execute the transaction
    // but it didn't save anything because
    // the username was already registered.
    if (!user) {
      logger.warn("constraint violated over public.users.'username'");
      result = new Response(
        "ERROR", 400, `The username "${username}" is already registered`);
    } else {
      logger.info(`user ${user.uuid} created`);
      result = new Response(
        "SUCESS", 201, user);
    }

  } catch (err) {
    logger.warn(err);
    result = new Response(
      "ERROR", 500, null, "Server was unable to fulfill operation");
  } finally {
    res.status(result.code).send(result);
    return;
  };
});

router.post("/login", [], async (req, res) => {});

module.exports = router;