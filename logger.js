"use strict";

const prefix = (level) => `${new Date().toISOString()} - ${level} - `;

/**
 * @param { * } item
 * @param { Number } index
 * @param { Array } arr
 * @returns { * }
 */
const mapIfJSON = (item, index, arr) => typeof item === "object" ? JSON.stringify(item) : item

/**
 * global console wrapper
 * to enhance information
 * across loggins.
 */
module.exports = {
  info: (...args) => console.log(
    prefix("INFO") +
    args.map(mapIfJSON).join(" - ")
  ),
  warn: (...args) => console.log(
    prefix("WARN") +
    args.map(mapIfJSON).join(" - ")
  )
};