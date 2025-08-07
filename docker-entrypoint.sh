#!/bin/sh

node ace migration:run --force

node ace db:user:create --firstname="$ADMIN_FIRSTNAME" --lastname="$ADMIN_LASTNAME" --email="$ADMIN_EMAIL" --password="$ADMIN_PASSWORD"
