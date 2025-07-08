#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

# If the first argument is "alembic", run the alembic command
if [ "$1" = "alembic" ]; then
    shift
    exec alembic "$@"
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Now execute the main command (passed as arguments to this script)
exec "$@"