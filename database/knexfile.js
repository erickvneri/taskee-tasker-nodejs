"use strict";
require("dotenv").config({ path: "../.env" });
const config = require("../config")

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: config.dbName,
      user: config.dbUsername,
      password: config.dbPassword,
      port: config.dbPort,
    },
    pool: {
      min: 2,
      max: config.maxConnections
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
