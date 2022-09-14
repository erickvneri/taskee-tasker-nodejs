"use strict";
const query = require("../database/query");

/**
 * @param { String } username
 * @param { String } password
 * @returns { Object }
 */
const createUser = (username, password) => {
  const userType = 1; // common
  const sqlQuery =
    `INSERT INTO users (
        uuid,
        user_role_id,
        username,
        password,
        created_at,
        updated_at
    ) SELECT
        gen_random_uuid(),
        $1,
        $2::VARCHAR(255),
        $3::VARCHAR(255),
        NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT id
        FROM users WHERE
        username = $2)
      RETURNING
        uuid,
        username,
        created_at,
        updated_at;`
    const replacements = [
      userType,
      username,
      password
    ];

    return query(sqlQuery, replacements);
};

module.exports = {
  createUser
};