"use strict";

const prefix = (level) => `${new Date().toISOString()} - ${level} - `;

module.exports = {
  info: (...args) => console.log(
    prefix("INFO") + args.join("    ")
  ),
  warn: (...args) => console.log(
    prefix("WARN") + args.join("    ")
  )
};