"use strict";
const logger = require("../logger");
const { Response }  = require("../util");
const { hasForbiddenCharacters, endsOrStartsWithAllowedSpecialCharacter } = require("../util/matchers");
const schema = require("schema")(process.env.ENV, {
  options: {
    "i18n": [],
    fallbacks: "TOLERANT_FALLBACKS",
    detectRecursion: true
  }
});

const createUserSchema = schema.Schema.create({
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 6,
      maxLength: 255,
      pre: function (input) {
        return input ? String(input).trim() : null;
      }
    },
    password: {
      type: "string",
      minLength: 8,
      maxLength: 255,
      pre: function (input) {
        return input ? String(input).trim() : null;
      }
    }
  },
  additionalProperties: false
});

/**
 * @param { Object } req
 * @param { Object } res
 * @param { Object } next
 */
const schemaMiddleware = (req, res, next) => {
  logger.info(req.body, req.headers)
  logger.warn(req.body, req.headers)
  let error = null;
  let message = null;
  try {
    // Schema validation
    const schemaRes = createUserSchema.validate(req.body);

    // Schema didn't match
    if (schemaRes.errors.length > 0) {
      logger.warn("schema rejected user input");
      message = schemaRes.errors.map(err => `"${err.attribute}" rule violated for attribute "${err.path[0]}"`);
      error = new Response("ERROR", 400, null, message);
    };

    // Check not allowed special characters
    const usernameCheck = hasForbiddenCharacters(req.body.username);
    const passwordCheck = hasForbiddenCharacters(req.body.password);
    if (usernameCheck || passwordCheck) {
      logger.warn("user input rejected by regex pattern");
      message = `user input must not contain special characters ("'\<>%$+^&;:|{}[])`;
      error = new Response("ERROR", 400, null, message);
    };

    // Check input tails for allowed
    // special characters on username
    const usernameCheck2 = endsOrStartsWithAllowedSpecialCharacter(req.body.username);
    if (usernameCheck2) {
      logger.warn("user input rejected by regex pattern");
      message = `user input must not end or start with special characters (-!#&*()_.,)`;
      error = new Response("ERROR", 400, null, message);
    }

    if (error) {
      res.status(error.statusCode).send(error);
      return;
    };

    // Passes current
    // input validations
    next();
  } catch (err) {
    logger.warn(err);
    error = new Response(
      "ERROR", 500, null, "Server was unable to fulfill operation");
    res.status(error.statusCode).send(error);
    return;
  };
};

module.exports = { schemaMiddleware };