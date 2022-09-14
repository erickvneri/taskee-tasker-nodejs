"use strict";
const query = require("../query");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const sqlBatch = `
    -- users.uuid index
    CREATE INDEX IF NOT EXISTS
    idx_users ON users (uuid);

    -- tokens.token index
    CREATE INDEX IF NOT EXISTS
    idx_tokens ON tokens (token);

    -- projects indexes
    CREATE INDEX IF NOT EXISTS
    idx_projects_uuid
    ON projects (uuid);
    CREATE INDEX IF NOT EXISTS
    idx_projects_user
    ON projects (owner_user_id);
    CREATE INDEX IF NOT EXISTS
    idx_projects_status
    ON projects (status_id);

    -- tasks indexes
    CREATE INDEX IF NOT EXISTS
    idx_task_uuid
    ON tasks (uuid);
    CREATE INDEX IF NOT EXISTS
    idx_tasks_task_id
    ON tasks (task_id);
    CREATE INDEX IF NOT EXISTS
    idx_tasks_project
    ON tasks (project_id);
    CREATE INDEX IF NOT EXISTS
    idx_tasks_reporter
    ON tasks (reporter_user_id);
    CREATE INDEX IF NOT EXISTS
    idx_tasks_assignee
    ON tasks (assignee_user_id);

    -- check lists indexes
    CREATE INDEX IF NOT EXISTS
    idx_checklist_uuid
    ON check_lists (uuid);`;

    try {
      await query(sqlBatch);
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
