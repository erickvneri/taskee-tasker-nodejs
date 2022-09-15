"use strict";

/**
 * HttpResponse is intended
 * to be used across all type of
 * responses across the resources.
 */
class HttpResponse {
  constructor (statusMessage, statusCode, data, error) {
    this.statusMessage = statusMessage;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
  }
}

module.exports = HttpResponse;