#!/usr/bin/env bash
# Launch Electron for dev mode on WSL2.
# Vite dev server must be running on localhost:5173 first.
# This script invokes the Windows Electron binary from WSL.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ELECTRON_EXE="$PROJECT_DIR/node_modules/.pnpm/electron@34.5.8/node_modules/electron/dist/electron.exe"

if [ ! -f "$ELECTRON_EXE" ]; then
  echo "Error: electron.exe not found at $ELECTRON_EXE"
  echo "Run: npm_config_platform=win32 pnpm rebuild electron"
  exit 1
fi

# Convert WSL path to Windows path for the main entry point
WIN_PROJECT_DIR=$(wslpath -w "$PROJECT_DIR")

exec "$ELECTRON_EXE" "$WIN_PROJECT_DIR"
