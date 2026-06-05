# Demo Output

Run the full check:

```bash
npm run check
```

The goal is not to produce a flashy dashboard. The goal is to prove that a fresh
server can become a repeatable AI work node:

- runtime is installed
- network checks work
- RSS feeds can be collected
- GitHub repos can be watched
- markdown output is generated for later review

## Example RSS digest

```markdown
# RSS Digest

Generated: 2026-06-05T16:07:05.051Z

## OpenAI News

- How Endava is redesigning software delivery around AI agents
- Dreaming: Better memory for a more helpful ChatGPT
- Biodefense in the Intelligence Age
```

## Example GitHub watch

```markdown
# GitHub Watch

Generated: 2026-06-05T16:07:08.392Z

## Model Context Protocol Servers

- Stars: 86781
- Open issues: 493
- Default branch: main

Recent commits:
- f5054df fix(deps): bump gitpython and urllib3
- 3a32d10 Add URL Elicitation cases
- 64b1cb0 feat(memory): add tool annotations
```

## Why markdown?

Markdown is the lowest-friction handoff format:

- humans can read it
- LLMs can summarize it
- git can version it
- cron and systemd can write it
- no dashboard has to be maintained first

