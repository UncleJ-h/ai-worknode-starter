import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataDir = process.env.WORKNODE_DATA_DIR || 'worknode-data';
const configPath = path.join(root, 'config', 'feeds.json');
const exampleConfigPath = path.join(root, 'config', 'feeds.example.json');
const outputPath = path.join(root, dataDir, 'rss-digest.md');

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

function extractItems(xml) {
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  const entryBlocks = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
  return [...itemBlocks, ...entryBlocks].slice(0, 5).map((block) => ({
    title: text(block, 'title'),
    link: text(block, 'link') || atomLink(block),
    date: text(block, 'pubDate') || text(block, 'updated') || text(block, 'published'),
  }));
}

function text(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!match) return '';
  return decode(match[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim());
}

function atomLink(block) {
  const match = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || '';
}

function decode(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

async function main() {
  await fs.mkdir(path.join(root, dataDir), { recursive: true });
  const feeds = await readJson(configPath, exampleConfigPath);
  const now = new Date().toISOString();
  const lines = [`# RSS Digest`, ``, `Generated: ${now}`, ``];

  for (const feed of feeds) {
    lines.push(`## ${feed.name}`, ``);
    try {
      const response = await fetch(feed.url, {
        headers: { 'user-agent': 'ai-worknode-starter/0.1' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const xml = await response.text();
      const items = extractItems(xml);
      if (items.length === 0) {
        lines.push(`- No items found.`);
      }
      for (const item of items) {
        const date = item.date ? ` (${item.date})` : '';
        const link = item.link ? ` - ${item.link}` : '';
        lines.push(`- ${item.title || 'Untitled'}${date}${link}`);
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
