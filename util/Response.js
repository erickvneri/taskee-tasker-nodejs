"use strict";

/**
 * HttpResponse is intended
 * to be used across all type of
 * responses across the resources.
 */
class HttpResponse {
  constructor (status, code, error, data) {
    this.status = status;
    this.code = code;
    this.error = error;
    this.data = data;
  }
}

module.exports = HttpResponse;