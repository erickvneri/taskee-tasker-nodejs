--
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Schema tables
--
--
-- user_role
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY NOT NULL,
    user_type USER_TYPE_ENUM,
    role_access role_access_enum []
);

--
-- users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    uuid UUID,
    user_role_id INT,
    username VARCHAR(255),
    password VARCHAR(255),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
-- users >> user role
ALTER TABLE users
ADD CONSTRAINT fk_user_role
FOREIGN KEY (user_role_id)
REFERENCES user_roles (id);

--
-- tokens
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT,
    token VARCHAR(255),
    refresh_token VARCHAR(255),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
);
-- tokens constraint >> users
ALTER TABLE tokens
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users (id);

--
-- status
CREATE TABLE IF NOT EXISTS status (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

--
-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY NOT NULL,
    uuid VARCHAR(255),
    name VARCHAR(255),
    owner_user_id INT,
    description VARCHAR,
    status_id INT,
    is_archived BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
-- projects >> users
ALTER TABLE projects
ADD CONSTRAINT fk_owner_project
FOREIGN KEY (owner_user_id)
REFERENCES users (id);
-- projects >> status
ALTER TABLE projects
ADD CONSTRAINT fk_project_status
FOREIGN KEY (status_id)
REFERENCES status (id);

--
-- users_projects
CREATE TABLE IF NOT EXISTS users_projects (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT,
    project_id INT
);
-- users_projects >> users
ALTER TABLE users_projects
ADD CONSTRAINT fk_users_projects
FOREIGN KEY (user_id)
REFERENCES users (id);
-- uers_projects >> projects
ALTER TABLE users_projects
ADD CONSTRAINT fk_projects_users
FOREIGN KEY (project_id)
REFERENCES projects (id);

--
-- tasks
-- handle depth level https://duckduckgo.com/?q=postgres+handle+depth+levels&t=brave&atb=v319-1&ia=web&iax=qa
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY NOT NULL,
    task_id INT,
    task_type TASK_TYPE_ENUM DEFAULT 'issue',
    name VARCHAR (255),
    description VARCHAR,
    project_id INT,
    status_id INT,
    reporter_user_id INT,
    assignee_user_id INT,
    due_date TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
-- tasks >> projects
ALTER TABLE tasks
ADD CONSTRAINT fk_task_project
FOREIGN KEY (project_id)
REFERENCES projects (id);
-- task >> status
ALTER TABLE tasks
ADD CONSTRAINT fk_task_status
FOREIGN KEY (status_id)
REFERENCES status (id);
-- task >> assignee
ALTER TABLE tasks
ADD CONSTRAINT fk_task_assignee
FOREIGN KEY (assignee_user_id)
REFERENCES users (id);
-- task >> reporter
ALTER TABLE tasks
ADD CONSTRAINT fk_task_reporter
FOREIGN KEY (reporter_user_id)
REFERENCES users (id);

--
-- check list
-- this will need trigger function
-- to raise if is_child = TRUE and
-- check_list_id = NULL
-- handle depth level https://duckduckgo.com/?q=postgres+handle+depth+levels&t=brave&atb=v319-1&ia=web&iax=qa
CREATE TABLE IF NOT EXISTS check_lists (
    id SERIAL PRIMARY KEY NOT NULL,
    task_id INT,
    check_list_id INT,
    name VARCHAR(255),
    description VARCHAR,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
-- check_list >> task
ALTER TABLE check_lists
ADD CONSTRAINT fk_task_check_list
FOREIGN KEY (task_id)
REFERENCES tasks (id);
-- check_list >> check_list
ALTER TABLE check_lists
ADD CONSTRAINT fk_inner_check_list
FOREIGN KEY (check_list_id)
REFERENCES check_lists (id);

--
-- rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    value VARCHAR (255) NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
-- Temp inserts
INSERT INTO rate_limits
(name, value, created_at, updated_at)
VALUES
('TASK_DEPTH_LIMIT', 5, NOW(), NOW()),
('CHECK_LIST_DEPTH_LIMIT', 5, NOW(), NOW());
