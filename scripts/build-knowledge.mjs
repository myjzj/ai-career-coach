/**
 * 从 knowledge/wNN.md 生成 data/knowledge.js。
 *
 * 用法：
 *   node scripts/build-knowledge.mjs
 *
 * Markdown 约定：
 *   # W01 · 标题
 *   ## Day 1 · 小节标题
 *   **一句话**：...
 *   **核心知识**
 *   - ...
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KNOWLEDGE_DIR = path.join(ROOT, "knowledge");
const OUT = path.join(ROOT, "data", "knowledge.js");

function pad2(n) { return String(n).padStart(2, "0"); }

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(s) {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return out;
}

function mdToHtml(md) {
  const lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;
  let list = null;
  let quote = [];
  let para = [];

  const flushPara = () => {
    if (para.length) {
      html.push("<p>" + inline(para.join(" ")) + "</p>");
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      html.push("</" + list + ">");
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      html.push("<blockquote>" + quote.map(inline).join("<br>") + "</blockquote>");
      quote = [];
    }
  };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```(.*)$/);
    if (fence) {
      flushAll();
      const lang = fence[1].trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      html.push('<pre class="md-code"' + (lang ? ' data-lang="' + escapeHtml(lang) + '"' : "") + "><code>" + escapeHtml(buf.join("\n")) + "</code></pre>");
      i++;
      continue;
    }
    if (/^\s*$/.test(line)) { flushAll(); i++; continue; }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushAll();
      const level = h[1].length;
      html.push("<h" + level + ">" + inline(h[2]) + "</h" + level + ">");
      i++;
      continue;
    }
    if (/^---+\s*$/.test(line)) { flushAll(); html.push("<hr>"); i++; continue; }
    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      flushPara(); flushList();
      quote.push(bq[1]);
      i++;
      continue;
    }
    flushQuote();
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ul) {
      flushPara();
      if (list !== "ul") { flushList(); html.push("<ul>"); list = "ul"; }
      html.push("<li>" + inline(ul[1]) + "</li>");
      i++;
      continue;
    }
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (list !== "ol") { flushList(); html.push("<ol>"); list = "ol"; }
      html.push("<li>" + inline(ol[1]) + "</li>");
      i++;
      continue;
    }
    flushList();
    para.push(line.trim());
    i++;
  }
  flushAll();
  return html.join("\n");
}

function cleanInline(s) {
  return String(s || "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function extractSection(md) {
  const summary = (md.match(/\*\*一句话\*\*[：:]\s*(.+)/) || [])[1] || "";
  const points = [];
  let inCore = false;
  for (const line of md.split("\n")) {
    if (/^\*\*核心知识\*\*/.test(line)) { inCore = true; continue; }
    if (inCore && /^\*\*/.test(line)) break;
    if (inCore) {
      const m = line.match(/^\s*[-*]\s+(.*)$/);
      if (m) points.push(cleanInline(m[1]));
      if (points.length >= 5) break;
    }
  }
  return { summary: cleanInline(summary), points };
}

function extractAfter(md, label, max) {
  const lines = md.split("\n");
  const out = [];
  let active = false;
  for (const line of lines) {
    if (new RegExp("^\\*\\*" + label + "\\*\\*").test(line)) { active = true; continue; }
    if (active && /^\*\*/.test(line)) break;
    if (active) {
      const m = line.match(/^\s*[-*]\s+(.*)$/);
      if (m) out.push(cleanInline(m[1]));
      if (out.length >= max) break;
    }
  }
  return out;
}

function extractQuote(md, label) {
  const lines = md.split("\n");
  let active = false;
  const out = [];
  for (const line of lines) {
    if (new RegExp("^\\*\\*" + label + "\\*\\*").test(line)) { active = true; continue; }
    if (active && /^\*\*/.test(line)) break;
    if (active && /^>\s?/.test(line)) out.push(cleanInline(line.replace(/^>\s?/, "")));
  }
  return out.join(" ").trim();
}

function extractDeep(md) {
  const lines = md.split("\n");
  const points = [];
  let active = false;
  for (const line of lines) {
    if (/^\*\*深入理解\*\*/.test(line)) { active = true; continue; }
    if (active && /^\*\*/.test(line)) break;
    if (active) {
      const m = line.match(/^\s*[-*]\s+(.*)$/);
      if (m) points.push(cleanInline(m[1]));
    }
  }
  const lineAfter = (label) => {
    const re = new RegExp("^\\*\\*" + label + "\\*\\*[：:]\\s*(.+)$");
    for (const line of lines) {
      const m = line.match(re);
      if (m) return cleanInline(m[1]);
    }
    return "";
  };
  return { deepPoints: points.slice(0, 4), scenario: lineAfter("场景"), followup: lineAfter("追问") };
}

// 读取课程，用于把每日任务挂到知识卡上
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["curriculum-1.js", "curriculum-2.js", "curriculum-3.js", "curriculum-4.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "data", f), "utf8"), ctx, { filename: f });
}
const CURRICULUM = ctx.window.CURRICULUM || [];
const taskMap = {};
for (const w of CURRICULUM) {
  for (const d of w.days) {
    const id = "w" + pad2(w.week) + "d" + d.day;
    taskMap[id] = (d.tasks || []).map((t) => t.text);
  }
}

const files = fs.readdirSync(KNOWLEDGE_DIR)
  .filter((f) => /^w\d{2}\.md$/.test(f))
  .sort();

const weeks = [];
const byDay = {};
for (const file of files) {
  const md = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf8").replace(/\r\n/g, "\n");
  const weekNo = Number(file.match(/^w(\d{2})\.md$/)[1]);
  const first = md.match(/^#\s+(.+)$/m);
  const title = first ? first[1].trim() : "W" + pad2(weekNo);
  const parts = md.split(/^## Day /m).slice(1);
  const days = [];
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const head = (nl >= 0 ? part.slice(0, nl) : part).trim();
    const m = head.match(/^(\d+)\s*·\s*(.+)$/);
    if (!m) continue;
    const dayNo = Number(m[1]);
    const dayTitle = m[2].trim();
    const body = (nl >= 0 ? part.slice(nl + 1) : "").trim();
    const id = "w" + pad2(weekNo) + "d" + dayNo;
    const { summary, points } = extractSection(body);
    const deep = extractDeep(body);
    const item = {
      id,
      week: weekNo,
      day: dayNo,
      title: dayTitle,
      summary,
      points,
      deepPoints: deep.deepPoints,
      scenario: deep.scenario,
      followup: deep.followup,
      pitfalls: extractAfter(body, "常见坑", 3),
      interview: extractQuote(body, "面试口述"),
      markdown: body,
      html: mdToHtml(body),
      tasks: taskMap[id] || [],
      file: "knowledge/" + file
    };
    days.push(item);
    byDay[id] = item;
  }
  weeks.push({ week: weekNo, title, file: "knowledge/" + file, days });
}

const payload = {
  generatedAt: new Date().toISOString(),
  source: "knowledge/wNN.md",
  weeks,
  byDay
};

const banner = "/* 由 scripts/build-knowledge.mjs 自动生成，请勿手改；编辑 knowledge/*.md 后重新构建。 */\n";
fs.writeFileSync(OUT, banner + "window.KNOWLEDGE = " + JSON.stringify(payload) + ";\n", "utf8");

console.log("generated", path.relative(ROOT, OUT));
console.log("weeks", weeks.length, "days", Object.keys(byDay).length);
for (const w of weeks) {
  if (w.days.length !== 7) console.warn("WARN week", w.week, "days", w.days.length);
}
