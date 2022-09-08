"use strict";
const query = require("../query");


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const sqlBatch =
    `--
    -- Custom Types
    --
    -- user_type
    CREATE TYPE user_type_enum AS ENUM (
        'common',
        'admin',
        'super_admin'
    );
    -- role_type enum
    CREATE TYPE role_access_enum AS ENUM (
        'users',
        'projects',
        'profiles'
    );
    -- task_type
    CREATE TYPE task_type_enum  AS ENUM (
        'task',
        'issue',
        'story'
    );`;

    try {
      await query(sqlBatch);
    } catch (err) {
      const message = err.message;
      if (message.includes("already exists")) return;
      throw new Error(err);
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = async function(knex) {
  console.warn("Not implemented.");
};