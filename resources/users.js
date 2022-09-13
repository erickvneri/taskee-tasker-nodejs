"use strict";
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

  let userUUID = null;
  let result = null;
  try {
    userUUID = await createUserService(username, password);

    // This may happen if the database
    // didn't fail to execute the transaction
    // but it didn't save anything because
    // the username was already registered.
    if (!userUUID) {
      throw new HttpError(
        400,
        "Bad Request",
        `The username "${username}" is already registered`);
    }

    // Build success response
    result = new Response(
      "SUCESS",
      201,
      null,
      { username, userUUID }
    );

  } catch (err) {
    if (err instanceof HttpError) {
      result = new Response(
        "ERROR",
        err.statusCode,
        err.message
      );
    } else {
      result = new Response(
        "ERROR",
        500,
        "Server was unable to fulfill operation"
      );
    };
  };

  // Success
  return res.status(result.code).send(result);
});

module.exports = router;