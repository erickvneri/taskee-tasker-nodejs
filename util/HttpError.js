"use strict";

/**
 * HttpError to handle low-level
 * exceptions raised by the system,
 * db, network, etc.
 *
 * @param { String } message
 * @returns { Object }
 */
class HttpError extends Error {
  constructor(statusCode, name, message) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

module.exports = HttpError;