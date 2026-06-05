# AI Worknode Starter

A small starter kit for turning a fresh Linux VPS into a personal AI work node.

This project is intentionally boring:

- install common runtime tools
- run a health check
- fetch RSS feeds into markdown logs
- watch GitHub releases/commits into markdown logs
- provide systemd examples for long-running jobs

It does not bypass platform rules, automate account abuse, or promise that any
IP type prevents risk checks. Treat a VPS as infrastructure for stable,
long-running work, not as a magic safety switch.

## Why this exists

Local machines are good for interaction. They are poor production environments
for background AI workflows:

- laptops sleep
- networks change
- local dependencies drift
- long jobs die when you reboot
- logs are scattered across terminals

A work node gives your AI workflows a small, always-on execution layer.

## What you get

```text
ai-worknode-starter/
  install.sh                  # conservative server bootstrap
  scripts/health-check.sh      # node, disk, memory, public IP, service checks
  apps/rss-digest/             # RSS to markdown log
  apps/github-watch/           # GitHub repo watch to markdown log
  config/                      # example config files
  systemd/                     # example user services/timers
```

## Quick start

On a fresh Debian/Ubuntu server:

```bash
git clone https://github.com/UncleJ-h/ai-worknode-starter.git
cd ai-worknode-starter
bash install.sh
cp .env.example .env
npm install
npm run health
```

Run sample jobs once:

```bash
npm run rss
npm run github
```

Generated logs are written to:

```text
worknode-data/
  rss-digest.md
  github-watch.md
```

## Configure feeds and repos

Copy the examples:

```bash
cp config/feeds.example.json config/feeds.json
cp config/repos.example.json config/repos.json
```

Edit them:

```json
[
  {
    "name": "OpenAI Blog",
    "url": "https://openai.com/news/rss.xml"
  }
]
```

```json
[
  {
    "name": "modelcontextprotocol/servers",
    "repo": "modelcontextprotocol/servers"
  }
]
```

## Optional: run with systemd

Copy the service and timer files:

```bash
mkdir -p ~/.config/systemd/user
cp systemd/*.service systemd/*.timer ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now ai-worknode-rss.timer
systemctl --user enable --now ai-worknode-github.timer
```

Check status:

```bash
systemctl --user list-timers 'ai-worknode-*'
systemctl --user status ai-worknode-rss.service
```

If you want user services to keep running after logout:

```bash
loginctl enable-linger "$USER"
```

## Security checklist

Before you run anything serious on a public server:

- use SSH keys instead of password login
- rotate the initial root password
- create a non-root user
- enable a firewall
- open only the ports you actually need
- never commit `.env`
- store API keys with minimum required permissions
- keep logs free of private tokens and account cookies

## What to put on a work node

Good candidates:

- RSS and web-monitoring jobs
- GitHub release/commit watchers
- lightweight MCP servers
- Telegram or Discord notification bots
- scheduled markdown reports
- small Claude Code / Codex helper workflows
- data collection jobs that need stable uptime

Bad candidates:

- secrets without access control
- heavy scraping that violates site rules
- anything requiring guaranteed account safety
- production workloads without monitoring and backups

## License

MIT
