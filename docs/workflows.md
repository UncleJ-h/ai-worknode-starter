# Workflow Ideas

Use this project as the smallest useful execution layer for personal AI
infrastructure. Each workflow should be useful as plain markdown first, then
optionally upgraded with LLM summarization, notifications, or MCP tools.

## 1. Daily AI intelligence digest

Watch model releases, product changelogs, engineering blogs, and research feeds.

Start with:

```bash
npm run rss
```

Output:

```text
worknode-data/rss-digest.md
```

Next layer:

- summarize the digest with your preferred LLM
- push the summary to Telegram, Discord, email, or a private note
- keep the raw markdown as the audit trail

## 2. GitHub release and commit watch

Track repos that matter to your work: MCP servers, agent SDKs, model tooling,
deployment platforms, or competitor projects.

Start with:

```bash
npm run github
```

Output:

```text
worknode-data/github-watch.md
```

Next layer:

- alert when a watched repo gets a new release
- summarize recent commits into a daily brief
- pipe important changes into a backlog or issue tracker

## 3. Remote Claude Code / Codex helper workspace

Use the VPS as a stable execution layer for long-running helper tasks while your
laptop remains the cockpit.

Good fit:

- repo watch
- log generation
- lightweight code checks
- scheduled reports
- reproducible experiments

Bad fit:

- unattended destructive deploys
- workflows that require private browser cookies
- anything you cannot audit from logs

## 4. Lightweight MCP server host

Run small MCP servers on a predictable machine instead of your laptop.

Good fit:

- local file indexers
- docs search wrappers
- narrow internal tools
- notification or reporting utilities

Keep the first version boring:

- one service
- one log file
- one restart policy
- no secrets in git

## 5. Bot and alert node

Turn the VPS into a notification node for things you do not want to poll by
hand.

Examples:

- send a Telegram message when a watched repo changes
- push a daily RSS summary
- alert when a script fails
- post a weekly markdown report

The important part is not the bot. The important part is that the bot runs from
a stable node with logs, timers, and explicit config.

