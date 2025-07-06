#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Source environment variables
if [ -f .env ]; then
    set -a
    . .env
    set +a
fi

# If the first argument is "alembic", run the alembic command
if [ "$1" = "alembic" ]; then
    shift
    exec alembic "$@"
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Run the seed script
echo "Seeding database..."
python -m seed

# Now execute the main command (passed as arguments to this script)
exec "$@"