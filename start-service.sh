#!/bin/bash
# Auto-generated start script for ff-hms-6900

cd "$(dirname "$0")"

# Force webpack for compatibility if Next.js 16
if grep -q '"next": ".*16\.' package.json; then
    echo "Starting ff-hms-6900 with webpack (Next.js 16)..."
    npm run dev -- --webpack
else
    echo "Starting ff-hms-6900..."
    npm run dev
fi
