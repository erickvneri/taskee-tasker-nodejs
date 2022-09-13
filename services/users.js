"use strict";
const { createUser } = require("../dao/users");
const { HttpError }  = require("../util");
const md5 = require("crypto-js/md5");

/**
 * @param { String } username
 * @param { String } password
 * @returns { String || null } // UUID
 */
const createUserService = async (username, password) => {
  password = md5(password).toString();

  let result = null;
  try {
    const createRes = await createUser(username, password);

    if (createRes.rowCount === 0) {
      return null
    };

    result = createRes.rows[0].uuid;
  } catch (err) {
    throw new Error("system failed to create user record");
  }

  return result;
};

module.exports = { createUserService };