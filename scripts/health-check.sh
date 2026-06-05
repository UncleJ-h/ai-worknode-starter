#!/usr/bin/env bash
set -euo pipefail

DATA_DIR="${WORKNODE_DATA_DIR:-worknode-data}"
mkdir -p "$DATA_DIR"

echo "== AI Worknode health check =="
echo "Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "Host: $(hostname)"
echo

check_cmd() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    echo "PASS command: $name ($(command -v "$name"))"
  else
    echo "WARN command missing: $name"
  fi
}

check_cmd node
check_cmd npm
check_cmd git
check_cmd curl
check_cmd tmux

echo
echo "== Runtime =="
if command -v node >/dev/null 2>&1; then
  node -v
fi
if command -v npm >/dev/null 2>&1; then
  npm -v
fi

echo
echo "== Public IP =="
if command -v curl >/dev/null 2>&1; then
  curl -fsS https://api.ipify.org || true
  echo
else
  echo "curl missing"
fi

echo
echo "== Disk =="
df -h .

echo
echo "== Memory =="
free -h 2>/dev/null || vm_stat 2>/dev/null || true

echo
echo "== Data directory =="
echo "$DATA_DIR"
ls -la "$DATA_DIR"
