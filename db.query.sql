-- name: CreateUser :execresult
insert into users (name, username, password, phone) 
       values  ( ?, ?, ?, ? );

-- name: FindUser :one
select * from users where id = ? limit 1;

-- name: ToggleUser :exec
update users set status =  1 - status where id = ?;

-- name: DeleteUser :exec
delete from users where id = ?;

-- name: CreateProject :execresult
insert into projects (title, description, start_date, end_date, status) 
       values (?, ?, ?, ?, ?);

-- name: FindProject :one
select * from projects where id = ? limit 1;

-- name: GetProject :many
select * from projects;

-- name: GetProjectsPaginated :many
SELECT * FROM projects
WHERE 
    (sqlc.narg('search') IS NULL OR title LIKE sqlc.narg('search') OR description LIKE sqlc.narg('search'))
    AND (sqlc.narg('status') IS NULL OR status = sqlc.narg('status'))
ORDER BY id DESC
LIMIT ? OFFSET ?;

-- name: UpdateProject :execresult
update projects set title = ?, description = ?, start_date = ?, end_date = ?, status = ? 
       where id = ?;

-- name: DeleteProject :exec
delete from projects where id = ?;

-- name: CreateTask :execresult
insert into tasks (title, description, start_date, end_date, status, project_id) 
       values (?, ?, ?, ?, ?, ?);

      -- name: FindTask :one
select * from tasks where id = ? limit 1;

-- name: UpdateTask :execresult
update tasks set title = ?, description = ?, start_date = ?, end_date = ?, status = ? 
       where id = ?;

-- name: DeleteTask :exec
delete from tasks where id = ?;

-- name: CreateNote :execresult
insert into notes (object_ref, object_id, content, user_id) 
       values (?, ?, ?, ?);

      -- name: FindNote :one
select * from notes where id = ? limit 1;

-- name: UpdateNote :execresult
update notes set object_ref = ?, object_id = ?, content = ?, user_id = ?
       where id = ?;

-- name: DeleteNote :exec
delete from notes where id = ?;

-- name: CreateStatus :execresult
insert into statuses (name, description) 
       values (?, ?);

      -- name: FindStatus :one
select * from statuses where id = ? limit 1;

-- name: UpdateStatus :execresult
update statuses set name = ?, description = ? where id = ?;

-- name: DeleteStatus :exec
delete from statuses where id = ?;

-- name: CreateRole :execresult
insert into roles (name, description) 
       values (?, ?);

      -- name: FindRole :one
select * from roles where id = ? limit 1;

-- name: UpdateRole :execresult
update roles set name = ?, description = ? where id = ?;

-- name: DeleteRole :exec
delete from roles where id = ?;

-- name: CreateAssignment :execresult
insert into assignments (user_id, object_ref, object_id, role_id, description) 
       values (?, ?, ?, ?, ?);

      -- name: FindAssignment :one
select * from assignments where id = ? limit 1;

-- name: UpdateAssignment :execresult
update assignments set user_id = ?, object_ref = ?, object_id = ?, role_id = ?, description = ? 
       where id = ?;

-- name: DeleteAssignment :exec
delete from assignments where id = ?;


