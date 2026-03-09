#!/bin/bash
# Build Electron Linux AppImage from WSL
# Usage: bash launch-linux-build.sh
#
# This script syncs the latest code from the Windows project directory,
# installs dependencies, builds the Vite bundle, and creates a Linux AppImage.
# The resulting AppImage is copied back to the Windows release/ directory.

set -e

WINDOWS_PROJECT="/mnt/c/Users/scott/tictactoe"
LINUX_BUILD="$HOME/tictactoe-linux"

echo "=== Tic-Tac-Toe Linux Build ==="

# Ensure the Linux build directory exists
if [ ! -d "$LINUX_BUILD" ]; then
    echo "Cloning project to Linux filesystem..."
    git clone "$WINDOWS_PROJECT" "$LINUX_BUILD"
else
    echo "Syncing latest code..."
    cd "$LINUX_BUILD"
    git pull "$WINDOWS_PROJECT" main --ff-only 2>/dev/null || {
        # If pull fails, reset from Windows source
        echo "Pull failed, doing fresh sync..."
        git fetch "$WINDOWS_PROJECT" main
        git reset --hard FETCH_HEAD
    }
fi

cd "$LINUX_BUILD"

# Install dependencies (Linux-native binaries)
echo "Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Build
echo "Building Vite bundle..."
pnpm build

echo "Building Linux AppImage..."
pnpm electron:build

# Copy result back to Windows
echo "Copying AppImage to Windows release directory..."
mkdir -p "$WINDOWS_PROJECT/release"
cp "$LINUX_BUILD/release/"*.AppImage "$WINDOWS_PROJECT/release/"

echo ""
echo "=== Build complete ==="
ls -lh "$LINUX_BUILD/release/"*.AppImage
echo ""
echo "AppImage copied to: $WINDOWS_PROJECT/release/"
