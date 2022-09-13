"use strict";
const query = require("../query");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const sqlQuery =
    `INSERT INTO user_roles (
      user_type,
      role_access
    ) SELECT $1, $2
    WHERE NOT EXISTS (
      SELECT *
      FROM user_roles
      WHERE user_type = $1
    );`;
  const userTypes = {
    "common": '{"projects","profiles"}',
    "admin": '{"users","projects","profiles"}',
    "super_admin": '{"users","projects","profiles"}'
  };

  try {
    for (let type of Object.keys(userTypes)) {
      const replacements = [type, userTypes[type]]
      await query(sqlQuery, replacements);
    }
  } catch (err) {
    throw new Error(err);
  };
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  console.warn("Not implemented");
};
