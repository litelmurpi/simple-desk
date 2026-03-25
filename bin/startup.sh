#!/bin/bash
# SimpleDesk Startup Script
# Starts Laravel dev server + Vite dev server

PROJECT_DIR="/var/www/html/simple-desk"

# Load NVM so that node/npm are available
export NVM_DIR="/home/azfab/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$PROJECT_DIR" || exit 1

# Start Laravel backend
/usr/bin/php artisan serve --host=127.0.0.1 --port=8000 &
LARAVEL_PID=$!

# Start Vite frontend
npm run dev &
VITE_PID=$!

echo "SimpleDesk started — Laravel PID: $LARAVEL_PID, Vite PID: $VITE_PID"

# Wait for both; if either exits, kill the other
wait -n
kill $LARAVEL_PID $VITE_PID 2>/dev/null
wait
