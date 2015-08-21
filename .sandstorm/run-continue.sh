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

# When we first switched to WiredTiger, we originally had journaling on.
# But that takes a lot of space on disk! Clean up any journal files that might still exist.
if [ -d /var/lib/mongodb.wiredTiger/journal ]; then
    rm -rf /var/lib/mongodb.wiredTiger/journal
fi

# By default, Mongo configures WiredTiger to make a checkpoint only every 60 seconds.
# Here we use an expert-mode configuration option to set that to 5 seconds.
mongo duoludo --eval 'db.adminCommand({"setParameter": 1, "wiredTigerEngineRuntimeConfig": "checkpoint=(wait=5)"})'

node /opt/app/server/index.js
