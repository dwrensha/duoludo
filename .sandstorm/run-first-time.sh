#!/bin/sh

mkdir -p /var/log/mongodb
mkdir -p /var/lib/mongodb.wiredTiger

/opt/app/.sandstorm/run-continue.sh
