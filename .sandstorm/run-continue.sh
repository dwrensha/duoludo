#!/bin/bash

set -ex

# The original version of the duoludo app used the mmapv1 storage engine,
# but we want to use the wiredTiger engine.
if [ -d /var/lib/mongodb ]; then
  # We need to migrate to the new storage engine!
  niscud -f /etc/mongod.conf --fork
  mongodump --host=127.0.0.1:27017 --out /var/migrationDump
  mongo --eval "db.getSiblingDB('admin').shutdownServer()"

  mkdir -p /var/lib/mongodb.wiredTiger # the new data directory
  mongod -f /etc/mongod.wiredTiger.conf --fork
  mongorestore --host=127.0.0.1:27017 /var/migrationDump
  rm -rf /var/migrationDump
  rm -rf /var/lib/mongodb
else
  # Usual startup. No migration necessary.
  mongod -f /etc/mongod.wiredTiger.conf --fork
fi


node /opt/app/server/index.js
