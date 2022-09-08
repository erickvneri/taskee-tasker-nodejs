"use strict";
const query = require("../query");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const sqlBatch =
    `-- BEFORE INSERT stored procedure that
    -- verifies the depth of tasks based on
    -- the task_id that each task row
    -- should own.
    CREATE OR REPLACE FUNCTION
        verify_tasks_depth_level()
    RETURNS TRIGGER
    AS $$
    DECLARE
        _depth INTEGER;
        _task_id INTEGER := NEW.task_id;
        _task_depth_limit INTEGER := (
            SELECT value::INTEGER
            FROM rate_limits WHERE
            name = 'TASK_DEPTH_LIMIT'
        );
    BEGIN
        -- Check whether task_id is referred,
        -- otherwise, a root task id is being
        -- created
        IF NEW.task_id IS NULL THEN
            RAISE NOTICE 'about to skip depth-limit check to create new root task record';
            RETURN NEW;
        END IF;

        -- Implement recursive CTE to verify
        -- the depth of task rows "from bottom
        -- to top" considering as parent the
        -- task.task_id of the inserted row.
        _depth := (WITH RECURSIVE _task_depth AS (
            -- Anchor
            SELECT id, task_id, 1 AS depth
            FROM tasks AS _t
            WHERE deleted_at IS NULL
            AND id = _task_id
            --
            UNION
            -- Recursive Member
            SELECT
                _t2.id, _t2.task_id, depth + 1
            FROM tasks AS _t2
            JOIN _task_depth
            ON _t2.id = _task_depth.task_id
            WHERE _t2.task_id IS NOT NULL
        ) SELECT MAX(depth) FROM _task_depth) AS depth;

        -- Rejection clause
        IF _depth >= _task_depth_limit THEN
            RAISE EXCEPTION 'task depth limit exceeded';
        END IF;

        -- i.e. the new task did not exceeded
        -- the depth of tasks starting in root
        -- task.
        RAISE NOTICE 'depth level of task % is: %', _task_id, _depth;
        RETURN NEW;
    END
    $$ LANGUAGE 'plpgsql';


CREATE TRIGGER verify_task_depth_before_insert
BEFORE INSERT OR UPDATE
ON tasks FOR EACH ROW
EXECUTE PROCEDURE verify_tasks_depth_level();
`;

  try {
    await query(sqlBatch);
  } catch (err) {
    const message = err.message;
      if (message.includes("already exists")) return;
      throw new Error(err);
  };
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const sqlBatch =
    `CREATE OR REPLACE FUNCTION
        verify_tasks_depth_level()
    RETURNS TRIGGER
    AS $$
    DECLARE
    BEGIN
      RAISE EXCEPTION 'Not implemented'
    END
    $$ LANGUAGE 'plpgsql';

    DROP TRIGGER
    verify_task_depth_before_insert
    ON tasks;`;

  try {
    await query(sqlBatch);
  } catch (err) {
    throw new Error(err);
  };
};
