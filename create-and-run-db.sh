#!/usr/bin/env bash
set -euo pipefail

# -------- configurable ----------
CONTAINER_NAME="secure-notes-database"
IMAGE="mysql:latest"
HOST_PORT="3966"
MYSQL_ROOT_PASSWORD="admin"
MYSQL_DATABASE="secure_notes"
# if you want a persistent named volume; set to "" to use an anonymous one
VOLUME_NAME="forge_sql_orm_mysql_data"
# --------------------------------

echo "==> Stop & remove previous container (if exists)"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}\$"; then
  docker rm -f -v "${CONTAINER_NAME}" >/dev/null || true
  echo "   removed ${CONTAINER_NAME} (+anonymous volumes)"
fi


docker run -d \
  --name "${CONTAINER_NAME}" \
  -e MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD}" \
  -e MYSQL_DATABASE="${MYSQL_DATABASE}" \
  -p "${HOST_PORT}:3306" \
  --restart always \
  "${IMAGE}" >/dev/null

echo "==> Waiting for MySQL to be ready on port ${HOST_PORT} ..."
 sleep 20

# extra sanity check
docker exec -e MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" -i "${CONTAINER_NAME}" \
  mysql -uroot -e "SELECT VERSION();" >/dev/null

echo "==> Ensure database '${MYSQL_DATABASE}' exists"
docker exec -e MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" -i "${CONTAINER_NAME}" \
  mysql -uroot -e "CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"


# Double-check by a trivial query
docker exec -i "${CONTAINER_NAME}" \
  mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT 1;" >/dev/null

echo "==> Creating table 'users' in database '${MYSQL_DATABASE}'"
docker exec -i "${CONTAINER_NAME}" \
  mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" "${MYSQL_DATABASE}" <<'SQL'
SET foreign_key_checks = 0;
CREATE TABLE IF NOT EXISTS security_notes (
  id varbinary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  target_user_id varchar(255) NOT NULL,
  target_user_name varchar(255) NOT NULL,
  expiry varchar(100) NOT NULL,
  is_custom_expiry tinyint NOT NULL,
  encryption_key_hash varchar(255) NOT NULL,
  iv varchar(255) NOT NULL,
  salt varchar(255) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(255) NOT NULL,
  status varchar(100) NOT NULL,
  deleted_at datetime DEFAULT NULL,
  expired_at datetime DEFAULT NULL,
  expiry_date datetime NOT NULL,
  viewed_at datetime DEFAULT NULL,
  target_avatar_url varchar(255) NOT NULL,
  created_user_name varchar(255) NOT NULL,
  created_avatar_url varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  issue_id varchar(255) DEFAULT NULL,
  issue_key varchar(255) DEFAULT NULL,
  project_id varchar(255) DEFAULT NULL,
  project_key varchar(255) DEFAULT NULL,
  PRIMARY KEY (id) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
SET foreign_key_checks = 1
SQL

echo "==> Done. MySQL is running on 127.0.0.1:${HOST_PORT}, DB=${MYSQL_DATABASE}"