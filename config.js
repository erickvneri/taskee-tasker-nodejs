"use strict";
require("dotenv").config();

module.exports = {
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS),
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT),
  connTimeoutMS: parseInt(process.env.DB_CONN_TIMEOUT_MS)
};