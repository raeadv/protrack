#!/bin/bash

# Development script to run both Go backend (air) and React frontend (vite)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development environment...${NC}"

# Function to cleanup processes on exit
cleanup() {
    echo -e "\n${RED}Shutting down development servers...${NC}"
    jobs -p | xargs -r kill
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Starting Go backend with Air...${NC}"
air &

echo -e "${GREEN}Starting React frontend with Vite...${NC}"
cd frontend && yarn dev &

# Wait for any process to exit
wait
