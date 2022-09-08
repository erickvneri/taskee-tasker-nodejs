--
-- Custom Types
--
-- user_type
CREATE TYPE user_type_enum AS ENUM (
    'common',
    'admin',
    'super_admin'
);
-- role_type enum
CREATE TYPE role_access_enum AS ENUM (
    'users',
    'projects',
    'profiles'
);
-- task_type
CREATE TYPE task_type_enum  AS ENUM (
    'task',
    'issue',
    'story'
);
