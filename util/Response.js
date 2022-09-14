"use strict";

/**
 * HttpResponse is intended
 * to be used across all type of
 * responses across the resources.
 */
class HttpResponse {
  constructor (status, code, data, error) {
    this.status = status;
    this.code = code;
    this.data = data;
    this.error = error;
  }
}

module.exports = HttpResponse;