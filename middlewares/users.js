"use strict";
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
      minLength: 8,
      maxLength: 255,
      pre: function (input) { return String(input).trim() }
    },
    password: {
      type: "string",
      minLength: 8,
      maxLength: 255,
      pre: function (input) { return String(input).trim() }
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
  // Schema validation
  const schemaRes = createUserSchema.validate(req.body);

  next();
};

module.exports = { schemaMiddleware };