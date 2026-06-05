import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataDir = process.env.WORKNODE_DATA_DIR || 'worknode-data';
const configPath = path.join(root, 'config', 'repos.json');
const exampleConfigPath = path.join(root, 'config', 'repos.example.json');
const outputPath = path.join(root, dataDir, 'github-watch.md');

async function readJson(file, fallbackFile) {
  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT' || !fallbackFile) throw error;
    raw = await fs.readFile(fallbackFile, 'utf8');
  }
  return JSON.parse(raw);
}

async function github(pathname) {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'ai-worknode-starter/0.1',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(`https://api.github.com${pathname}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function main() {
  await fs.mkdir(path.join(root, dataDir), { recursive: true });
  const repos = await readJson(configPath, exampleConfigPath);
  const now = new Date().toISOString();
  const lines = [`# GitHub Watch`, ``, `Generated: ${now}`, ``];

  for (const item of repos) {
    lines.push(`## ${item.name || item.repo}`, ``);
    try {
      const repo = await github(`/repos/${item.repo}`);
      const commits = await github(`/repos/${item.repo}/commits?per_page=3`);
      lines.push(`- Stars: ${repo.stargazers_count}`);
      lines.push(`- Open issues: ${repo.open_issues_count}`);
      lines.push(`- Default branch: ${repo.default_branch}`);
      lines.push(``);
      lines.push(`Recent commits:`);
      for (const commit of commits) {
        const message = commit.commit.message.split('\n')[0];
        lines.push(`- ${commit.sha.slice(0, 7)} ${message} - ${commit.html_url}`);
      }
    } catch (error) {
      lines.push(`- ERROR: ${error.message}`);
    }
    lines.push(``);
  }

  await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
