#!/bin/sh

node ace migration:run --force

if [ ! -f tmp/first_run ]; then
  node ace db:user:create --firstname="$ADMIN_FIRSTNAME" --lastname="$ADMIN_LASTNAME" --email="$ADMIN_EMAIL" --password="$ADMIN_PASSWORD"
  touch tmp/first_run
fi
