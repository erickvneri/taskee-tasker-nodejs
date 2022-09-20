"use strict";
const { createUser } = require("../daos/users");
const md5 = require("crypto-js/md5");

/**
 * @param { String } username
 * @param { String } password
 * @returns { Object }
 */
const createUserService = async (username, password) => {
  // Hide password
  password = md5(password).toString();

  // Create record
  let result = await createUser(username, password);

  // Only if silent unique
  // constraint is violated
  if (result.rowCount === 0) return null;

  result = result.rows[0];
  return {
    uuid: result.uuid,
    username: result.username,
    createdAt: result.created_at
  };
};

module.exports = { createUserService };
