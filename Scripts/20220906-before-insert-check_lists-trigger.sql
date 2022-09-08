-- BEFORE INSERT stored procedure that
-- verifies the depth of tasks based on
-- the task_id that each task row
-- should own.
CREATE OR REPLACE FUNCTION
    verify_check_lists_depth_level()
RETURNS TRIGGER
AS $$
DECLARE
    _depth INTEGER;
    _check_list_id INTEGER := NEW.check_list_id;
    _check_list_depth_limit INTEGER := (
        SELECT value::INTEGER
        FROM rate_limits
        WHERE "name" = 'CHECK_LIST_DEPTH_LIMIT'
    );
BEGIN
    -- Check whether check_list_id is referred,
    -- otherwise, a root check_list id is being
    -- created.
    IF NEW.check_list_id IS NULL THEN
        RAISE NOTICE 'about to skip depth-limit check to create new root check_list record';
        RETURN NEW;
    END IF;

        -- Implement recursive CTE to verify
        -- the depth of check_lists rows "from
        -- bottom to top" considering as parent
        -- the check_list.check_list_id of the
        -- inserted row.
        _depth := (WITH RECURSIVE _check_list_depth AS (
            -- Anchor
            SELECT id, check_list_id, 1 AS depth
            FROM check_lists AS _t
            WHERE deleted_at IS NULL
            AND id = _check_list_id
            --
            UNION
            -- Recursive Member
            SELECT
                _cl2.id, _cl2.check_list_id, depth + 1
            FROM check_lists AS _cl2
            JOIN _check_list_depth
            ON _cl2.id = _check_list_depth.check_list_id
            WHERE _cl2.check_list_id IS NOT NULL
        ) SELECT MAX(depth) FROM _check_list_depth) AS depth;

        RAISE NOTICE '%', _depth;

        -- Rejection clause
        IF _depth >= _check_list_depth_limit THEN
            RAISE EXCEPTION 'check list depth limit exceeded';
        END IF;

        -- i.e. the new task did not exceeded
        -- the depth of tasks starting in root
        -- task.
        RAISE NOTICE 'depth level of check_list % is: %', _check_list_id, _depth;
        RETURN NEW;
END
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER verify_check_lists_depth_before_insert
BEFORE INSERT OR UPDATE
ON check_lists FOR EACH ROW
EXECUTE PROCEDURE verify_check_lists_depth_level();
