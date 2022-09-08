"use strict";
const pool = require("./pool");

/**
 * Calls a Pool node-postgres instance
 * and returns a pending Promise.
 *
 * @param { String } query
 * @param { Array } replacements
 * @returns { Promise }
 */
module.exports = (query, replacements) =>
  new Promise((resolve, reject) => {
    pool().query(query, replacements, (err, result) => {
      if (err) {
        reject(err)
      };
      resolve(result);
    });
  })