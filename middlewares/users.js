"use strict";
const logger = require("../logger");
const { Response, HttpError }  = require("../util");
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
  let error;
  try {
    // Schema validation
    const schemaRes = createUserSchema.validate(req.body);

    if (schemaRes.errors.length > 0) {
      error = schemaRes.errors.map(err => `"${err.attribute}" rule violated for attribute "${err.path[0]}"`);
      throw new Error(error);
    };
    next();
  } catch (err) {
    logger.warn(err);
    res.status(400).send(err.message);
    return;
  };
};

module.exports = { schemaMiddleware };