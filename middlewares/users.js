"use strict";
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

    if (schemaRes.errors.length > 0)
      throw new HttpError(
        400, "Bad request",
        schemaRes.errors.map(err => `"${err.attribute}" rule violated for attribute "${err.path[0]}"`));

    //TODO: regex validation

    next();
  } catch (err) {
    if (err instanceof HttpError) {
      error = new Response("ERROR", err.statusCode, err.message);
    } else {
      throw new HttpError(
        500, "Internal Server Error",
        "Server wasn't able to handle the operation");
    };

    res.status(err.statusCode)
       .send(error);
  }
};

module.exports = { schemaMiddleware };