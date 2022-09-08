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

-- checklists indexes
CREATE INDEX IF NOT EXISTS
idx_checklist_checklist_id
ON check_lists (check_list_id);
CREATE INDEX IF NOT EXISTS
idx_chechlist_task
ON check_lists (task_id);
