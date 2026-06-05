#!/usr/bin/env bash
set -euo pipefail

echo "== AI Worknode Starter bootstrap =="

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This installer is intended for Debian/Ubuntu Linux servers."
  echo "You can still run the Node apps manually on other systems."
  exit 1
fi

if command -v apt-get >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y curl git ca-certificates build-essential tmux htop ufw
else
  echo "apt-get not found. Install curl, git, tmux, htop, and a firewall manually."
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found."
  echo "Install Node.js 20+ with your preferred method, then rerun npm commands."
else
  echo "Node.js: $(node -v)"
fi

mkdir -p worknode-data

if [[ ! -f config/feeds.json ]]; then
  cp config/feeds.example.json config/feeds.json
fi

if [[ ! -f config/repos.json ]]; then
  cp config/repos.example.json config/repos.json
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

echo
echo "Bootstrap complete."
echo "Next:"
echo "  npm install"
echo "  npm run health"
echo "  npm run rss"
echo "  npm run github"
