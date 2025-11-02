CREATE TABLE users (
  id   BIGINT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name text    NOT NULL,
  username text    NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone  text,
  status TINYINT default 1
);

CREATE TABLE projects (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  user_id BIGINT NULL,
  start_date date NULL,
  end_date date NULL,
  status TINYINT NOT NULL default 0
);

CREATE TABLE tasks (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  user_id BIGINT NULL,
  start_date date NULL,
  end_date date NULL,
  status TINYINT NOT NULL default 0
);

CREATE TABLE notes (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  object_ref CHAR(50) NULL COMMENT 'either projects or tasks', 
  object_id BIGINT NULL COMMENT 'primary id of projects or tasks',
  content text,
  user_id BIGINT NULL,
  created_at DATETIME NULL default CURRENT_TIMESTAMP,
  updated_at DATETIME NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE statuses (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name CHAR(100) NOT NULL UNIQUE,
  description text NULL
);


CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name CHAR(100) NOT NULL UNIQUE,
  description text NULL
);


CREATE TABLE assignments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  object_ref CHAR(50) NULL COMMENT 'either projects or tasks', 
  object_id BIGINT NULL COMMENT 'primary id of projects or tasks',
  role_id INT NULL,
  description text NULL
);

