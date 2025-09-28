#!/bin/bash
# Keep-alive script to prevent Codespace disconnections

echo "Starting Armora keep-alive system..."

# Function to check if server is running
check_server() {
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
        return 0
    elif curl -s http://localhost:3000 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to restart server if needed
restart_server() {
    echo "$(date): Server not responding, restarting..."
    pkill -f "react-scripts start" 2>/dev/null
    sleep 2
    cd /workspaces/armora
    npm run fresh > /dev/null 2>&1 &
    sleep 10
}

# Function to keep Codespace active
keep_active() {
    # Touch a file to show activity
    touch /tmp/codespace-active-$(date +%s)

    # Make a small HTTP request to keep network active
    if check_server; then
        curl -s http://localhost:3002 > /dev/null 2>&1 || curl -s http://localhost:3000 > /dev/null 2>&1
    fi
}

# Main loop
while true; do
    if ! check_server; then
        restart_server
    fi

    keep_active

    # Wait 30 seconds
    sleep 30
done