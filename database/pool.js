"use strict";
const config = require("../config");
const { Pool } = require("pg");

let pool = null;


module.exports = () => {
  if (pool !== null) return pool;

  pool = new Pool({
    host: config.dbHost,
    user: config.dbUsername,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
    max: config.maxConnections,
    idleTimeoutMillis: config.idleTimeout,
    connectionTimeoutMillis: config.connTimeoutMS
  });

  return pool;
};
