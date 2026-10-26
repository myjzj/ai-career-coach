/* =========================================================
   AI 跃迁 · 学习驾驶舱
   Vanilla JS, zero dependencies, localStorage persistence.
   ========================================================= */
(function () {
  "use strict";

  const META = window.APP_META || {};
  const WEEKS = (window.CURRICULUM || []).slice();
  const QUIZ = (window.QUIZ_BANK || []).slice();
  const INTERVIEW = window.INTERVIEW_BANK || [];
  const KNOWLEDGE = window.KNOWLEDGE || { weeks: [], byDay: {} };
  const QUICK_QUIZ = window.QUICK_QUIZ || [];
  const STORE_KEY = "ai-jump-coach-v1";
  const DAY_MS = 86400000;
  const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const TYPE_LABEL = { learn: "学习", lab: "实验", project: "项目", review: "复盘", career: "求职" };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ---------------- utils ---------------- */
  function pad2(n) { return String(n).padStart(2, "0"); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function icon(name, cls) {
    return '<svg class="' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function round(n) { return Math.round(n); }
  function pct(part, total) { return total ? clamp(part / total, 0, 1) : 0; }
  function fmtPct(v) { return Math.round((v || 0) * 100) + "%"; }
  function fmtDate(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function todayStr() { return fmtDate(new Date()); }
  function parseDate(s) {
    const p = String(s || "").split("-").map(Number);
    return new Date(p[0], (p[1] || 1) - 1, p[2] || 1, 12, 0, 0, 0);
  }
  function dateUTC(s) {
    const p = String(s || "").split("-").map(Number);
    return Date.UTC(p[0], (p[1] || 1) - 1, p[2] || 1);
  }
  function addDays(s, n) {
    const d = parseDate(s);
    d.setDate(d.getDate() + n);
    return fmtDate(d);
  }
  function daysBetween(a, b) { return Math.round((dateUTC(b) - dateUTC(a)) / DAY_MS); }
  function weekdayCN(s) { return WEEKDAYS[parseDate(s).getDay()]; }
  function prettyDate(s) {
    const d = parseDate(s);
    return (d.getMonth() + 1) + " 月 " + d.getDate() + " 日";
  }
  function shortDate(s) {
    const d = parseDate(s);
    return pad2(d.getMonth() + 1) + "." + pad2(d.getDate());
  }
  function timeAgo(iso) {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return Math.floor(diff / 60000) + " 分钟前";
    if (diff < 86400000) return Math.floor(diff / 3600000) + " 小时前";
    return Math.floor(diff / 86400000) + " 天前";
  }
  function seededShuffle(arr, seed) {
    const a = arr.slice();
    let s = seed >>> 0;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const j = s % (i + 1);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function plural(n, unit) { return n + " " + unit; }

  /* ---------------- state ---------------- */
  function defaultState() {
    return {
      version: 1,
      settings: {
        startDate: META.startDate || "2026-10-26",
        theme: "light",
        name: "",
        targetRole: META.targetRole || "AI 应用开发工程师",
        dailyMinutes: 150
      },
      days: {},
      quiz: {},
      cards: {},
      applications: [],
      checklists: {},
      stories: {},
      prep: {},
      interviewMastered: {},
      knowledgeRead: {},
      meta: { createdAt: todayStr(), lastOpen: todayStr() }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings || {}) },
        days: parsed.days || {},
        quiz: parsed.quiz || {},
        cards: parsed.cards || {},
        applications: Array.isArray(parsed.applications) ? parsed.applications : [],
        checklists: parsed.checklists || {},
        stories: parsed.stories || {},
        prep: parsed.prep || {},
        interviewMastered: parsed.interviewMastered || {},
        knowledgeRead: parsed.knowledgeRead || {},
        meta: { ...base.meta, ...(parsed.meta || {}) }
      };
    } catch (e) {
      console.warn("读取本地数据失败，使用默认状态", e);
      return defaultState();
    }
  }

  let state = loadState();
  state.meta.lastOpen = todayStr();

  function saveState(quiet) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      if (!quiet) updateMeta();
    } catch (e) {
      console.warn("保存失败", e);
      toast("保存失败：浏览器存储空间可能已满，请先导出备份");
    }
  }

  /* ---------------- plan ---------------- */
  const PHASE_BY_ID = {};
  (META.phases || []).forEach((p) => { PHASE_BY_ID[p.id] = p; });

  function buildPlan() {
    const weeks = WEEKS.slice().sort((a, b) => a.week - b.week);
    const days = [];
    weeks.forEach((w) => {
      w.days = (w.days || []).slice().sort((a, b) => a.day - b.day);
      w.phaseInfo = PHASE_BY_ID[w.phase] || (META.phases || [])[0] || { name: "阶段", color: "#d64b2a" };
      w.days.forEach((d) => {
        d.week = w.week;
        d.phase = w.phase;
        d.phaseInfo = w.phaseInfo;
        d.theme = w.theme;
        d.weekGoal = w.goal;
        d.weekResources = w.resources || [];
        d.index = days.length;
        d.id = "w" + pad2(w.week) + "d" + d.day;
        d.date = addDays(state.settings.startDate, d.index);
        d.weekday = weekdayCN(d.date);
        days.push(d);
      });
    });
    const byId = {};
    days.forEach((d) => { byId[d.id] = d; });
    return { weeks, days, byId };
  }

  let PLAN = buildPlan();

  function refreshDates() {
    PLAN.days.forEach((d, i) => {
      d.date = addDays(state.settings.startDate, i);
      d.weekday = weekdayCN(d.date);
    });
  }

  function currentIndex() {
    const diff = daysBetween(state.settings.startDate, todayStr());
    if (diff < 0) return -1;
    return Math.min(diff, PLAN.days.length - 1);
  }
  function isPlanOver() {
    return daysBetween(state.settings.startDate, todayStr()) >= PLAN.days.length;
  }
  function currentDay() {
    const i = currentIndex();
    return i >= 0 ? PLAN.days[i] : null;
  }
  function todayIndexExact() {
    return daysBetween(state.settings.startDate, todayStr());
  }

  /* ---------------- day state / stats ---------------- */
  function getDayState(id) {
    if (!state.days[id]) {
      state.days[id] = {
        tasks: {},
        notes: { learned: "", questions: "", action: "" },
        minutes: 0,
        completed: false,
        completedAt: null,
        lastActiveAt: null,
        quiz: null,
        oral: { revealed: false, rating: 0 }
      };
    }
    const ds = state.days[id];
    ds.tasks = ds.tasks || {};
    ds.notes = { learned: "", questions: "", action: "", ...(ds.notes || {}) };
    ds.minutes = Number(ds.minutes) || 0;
    ds.oral = { revealed: false, rating: 0, ...(ds.oral || {}) };
    ds.quick = ds.quick || null;
    return ds;
  }

  function isKnowledgeRead(id) { return !!state.knowledgeRead[id]; }
  function hasKnowledge(day) { return !!knowledgeForDay(day.id); }
  function markKnowledgeRead(id, value) {
    if (value) state.knowledgeRead[id] = true;
    else delete state.knowledgeRead[id];
  }
  function toggleKnowledgeRead(id) {
    const next = !isKnowledgeRead(id);
    markKnowledgeRead(id, next);
    saveState();
    const modal = $(".knowledge-modal");
    if (modal) openKnowledge(id);
    else render();
    toast(next ? "已标记为已读" : "已取消已读");
  }
  function quickQuizItemsForDay(day) {
    if (!day) return [];
    let base = QUIZ.filter((q) => q.week === day.week && q.day === day.day).slice(0, 2);
    if (base.length < 2) {
      base = seededShuffle(QUIZ.filter((q) => q.week === day.week), day.week * 31 + 7).slice(0, 2);
    }
    const items = base.map(mcqItem);
    const extra = QUICK_QUIZ.find((q) => q.dayId === day.id);
    if (extra) items.push(mcqItem(extra));
    return items.slice(0, 3);
  }

  function taskDone(ds, i) { return !!(ds.tasks && ds.tasks[i]); }
  function dayProgress(day) {
    const ds = getDayState(day.id);
    const total = day.tasks.length;
    const done = day.tasks.reduce((n, _, i) => n + (taskDone(ds, i) ? 1 : 0), 0);
    return { done, total, pct: pct(done, total), all: done === total };
  }
  function hasActivity(day) {
    if (!day) return false;
    const ds = state.days[day.id];
    if (!ds) return false;
    const tasks = Object.values(ds.tasks || {}).filter(Boolean).length;
    const notes = Object.values(ds.notes || {}).some((v) => String(v || "").trim().length > 0);
    const quiz = !!ds.quiz;
    const oral = ds.oral && ds.oral.rating > 0;
    const read = isKnowledgeRead(day.id);
    return tasks > 0 || notes || quiz || oral || read || !!ds.completed;
  }
  function calcStreak() {
    let idx = currentIndex();
    if (idx < 0) return 0;
    if (!hasActivity(PLAN.days[idx])) idx -= 1;
    let n = 0;
    while (idx >= 0 && hasActivity(PLAN.days[idx])) { n++; idx--; }
    return n;
  }
  function completedDays() { return PLAN.days.filter((d) => state.days[d.id] && state.days[d.id].completed).length; }
  function totalMinutes() { return PLAN.days.reduce((n, d) => n + ((state.days[d.id] && state.days[d.id].minutes) || 0), 0); }
  function allTaskStats() {
    let done = 0, total = 0;
    PLAN.days.forEach((d) => {
      const p = dayProgress(d);
      done += p.done; total += p.total;
    });
    return { done, total, pct: pct(done, total) };
  }
  function quizAverage() {
    const vals = PLAN.days.map((d) => state.days[d.id] && state.days[d.id].quiz ? state.days[d.id].quiz.best : null).filter((v) => v != null);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  function quizAttemptStats() {
    let attempts = 0, correct = 0;
    Object.values(state.quiz).forEach((s) => { attempts += s.attempts || 0; correct += s.correct || 0; });
    return { attempts, correct, accuracy: attempts ? correct / attempts : 0 };
  }
  function weekProgress(week) {
    let done = 0, total = 0;
    week.days.forEach((d) => { const p = dayProgress(d); done += p.done; total += p.total; });
    return { done, total, pct: pct(done, total) };
  }
  function phaseProgress(phase) {
    let done = 0, total = 0;
    PLAN.weeks.filter((w) => w.phase === phase.id).forEach((w) => {
      const p = weekProgress(w); done += p.done; total += p.total;
    });
    return { done, total, pct: pct(done, total) };
  }
  function weekForNumber(n) { return PLAN.weeks.find((w) => w.week === n); }

  /* ---------------- quiz data ---------------- */
  const QUIZ_INDEX = {};
  QUIZ.forEach((q) => { QUIZ_INDEX[q.id] = q; });
  QUICK_QUIZ.forEach((q) => { QUIZ_INDEX[q.id] = q; });

  function mcqItem(q) {
    return { kind: "mcq", id: q.id, q: q.q, options: q.options, answer: q.answer, explain: q.explain, topic: q.topic, week: q.week, day: q.day };
  }
  function oralItem(day) {
    return {
      kind: "oral", id: "oral-" + day.id, q: day.oral.q, answer: day.oral.a,
      keywords: day.oral.keywords || [], week: day.week, day: day.day, dayId: day.id
    };
  }
  function quizItemsForDay(day) {
    if (!day) return [];
    if (day.day === 7) return weeklyItems(day.week);
    const qs = QUIZ.filter((q) => q.week === day.week && q.day === day.day);
    const items = qs.map(mcqItem);
    if (day.oral && day.oral.q) items.push(oralItem(day));
    return items;
  }
  function weeklyItems(weekNo) {
    const pool = QUIZ.filter((q) => q.week === weekNo);
    const picked = seededShuffle(pool, weekNo * 997 + 17).slice(0, Math.min(10, pool.length));
    const items = picked.map(mcqItem);
    const week = weekForNumber(weekNo);
    if (week) {
      [1, 4].forEach((n) => {
        const d = week.days.find((x) => x.day === n);
        if (d && d.oral && d.oral.q) items.push(oralItem(d));
      });
    }
    return items;
  }
  function dayQuizStatus(day) {
    const ds = getDayState(day.id);
    const items = quizItemsForDay(day);
    const best = ds.quiz ? ds.quiz.best : null;
    return { items, best, pass: best != null && best >= 0.8, attempts: ds.quiz ? ds.quiz.attempts : 0 };
  }
  function wrongQuestions() {
    return Object.keys(state.quiz)
      .filter((id) => state.quiz[id] && state.quiz[id].wrong > 0 && !state.quiz[id].mastered && QUIZ_INDEX[id])
      .map((id) => QUIZ_INDEX[id]);
  }
  function dueCards() {
    const t = todayStr();
    return Object.keys(state.cards)
      .map((id) => ({ id, ...state.cards[id] }))
      .filter((c) => c && c.due && c.due <= t && !c.suspended)
      .sort((a, b) => String(a.due).localeCompare(String(b.due)));
  }
  function allCards() {
    return Object.keys(state.cards).map((id) => ({ id, ...state.cards[id] })).filter(Boolean);
  }
  function addCard(id, data) {
    if (!state.cards[id]) {
      state.cards[id] = {
        due: todayStr(), interval: 0, ease: 2.5, reps: 0, lapses: 0,
        created: todayStr(), last: null, lastRating: null, ...data
      };
    } else {
      state.cards[id] = { ...state.cards[id], ...data };
    }
  }

  /* ---------------- theme / ui ---------------- */
  function applyTheme() {
    const theme = state.settings.theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    const mobileUse = document.querySelector("#theme-btn-mobile use");
    if (mobileUse) mobileUse.setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon");
    $$("[data-theme-icon]").forEach((el) => { el.setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon"); });
  }
  function toggleTheme() {
    state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
    applyTheme();
    saveState(true);
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function celebrate() {
    const root = $("#confetti");
    if (!root) return;
    root.innerHTML = "";
    const colors = ["#d64b2a", "#1c6b61", "#a97712", "#34618f", "#6b5b95"];
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = (Math.random() * 0.25) + "s";
      s.style.transform = "rotate(" + (Math.random() * 180) + "deg)";
      root.appendChild(s);
    }
    setTimeout(() => { root.innerHTML = ""; }, 2200);
  }

  function openModal(html, cls) {
    const root = $("#modal-root");
    root.innerHTML = '<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal ' + (cls || "") + '" role="dialog" aria-modal="true">' + html + "</div></div>";
    document.body.style.overflow = "hidden";
    const first = root.querySelector("input, textarea, button");
    if (first) setTimeout(() => first.focus(), 60);
  }
  function closeModal() {
    $("#modal-root").innerHTML = "";
    document.body.style.overflow = "";
  }

  /* ---------------- navigation ---------------- */
  function route() {
    const h = (location.hash || "").replace(/^#/, "");
    return h || "/today";
  }
  function navigate(path) { location.hash = path; }

  function setActiveNav(r) {
    $$(".nav-item").forEach((a) => {
      const target = a.dataset.route;
      const active = target === r || (target === "/today" && r.indexOf("/day/") === 0);
      a.classList.toggle("active", active);
    });
  }

  function updateMeta() {
    const streak = calcStreak();
    const sNum = $("#streak-num");
    if (sNum) sNum.textContent = streak;
    const sHint = $("#streak-hint");
    if (sHint) {
      sHint.textContent = streak > 0
        ? "保持节奏，今天也完成一个任务"
        : (currentIndex() < 0 ? "开营前先做好准备" : "今天开始，先完成 1 个任务");
    }
    const due = dueCards().length;
    const wrong = wrongQuestions().length;
    [["#nav-due", due], ["#nav-review", due], ["#nav-wrong", wrong]].forEach(([sel, n]) => {
      const el = $(sel);
      if (!el) return;
      el.textContent = n > 99 ? "99+" : String(n);
      el.classList.toggle("show", n > 0);
    });
  }

  /* ---------------- shared components ---------------- */
  function ring(p, size, label, sub) {
    const r = 54;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - clamp(p, 0, 1));
    return '<div class="ring" style="width:' + size + "px;height:" + size + 'px">' +
      '<svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="' + r + '"/>' +
      '<circle class="value" cx="60" cy="60" r="' + r + '" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + offset.toFixed(2) + '"/></svg>' +
      '<div class="ring-label"><b>' + label + "</b><span>" + sub + "</span></div></div>";
  }

  function phaseChip(day) {
    return '<span class="chip" style="background:' + day.phaseInfo.color + '1a;color:' + day.phaseInfo.color + '"><span class="dot"></span>' + esc(day.phaseInfo.name) + "</span>";
  }

  function typeChip(day) {
    return '<span class="chip">' + icon("spark") + esc(TYPE_LABEL[day.type] || "学习") + "</span>";
  }

  function navArrows(day) {
    const prev = PLAN.days[day.index - 1];
    const next = PLAN.days[day.index + 1];
    return '<div class="page-actions">' +
      (prev ? '<a class="btn btn-sm btn-soft" href="#/day/' + prev.id + '">' + icon("arrow-left") + "前一天</a>" : "") +
      (next ? '<a class="btn btn-sm btn-soft" href="#/day/' + next.id + '">后一天' + icon("arrow-right") + "</a>" : "") +
      (day.date !== todayStr() && currentDay() ? '<a class="btn btn-sm" href="#/today">回到今天</a>' : "") +
      "</div>";
  }

  /* ---------------- today / day view ---------------- */
  function knowledgeForDay(id) {
    return (KNOWLEDGE.byDay && KNOWLEDGE.byDay[id]) || null;
  }

  function knowledgeCard(day) {
    const item = knowledgeForDay(day.id);
    if (!item) return "";
    const points = (item.points || []).slice(0, 3);
    const read = isKnowledgeRead(day.id);
    return '<section class="knowledge-card ' + (read ? "is-read" : "") + '">' +
      '<div class="kc-main"><div class="kc-kicker">' + icon("book") + "TODAY'S NOTE · W" + pad2(day.week) + " D" + day.day +
      (read ? '<span class="kc-read-tag">已读</span>' : '<span class="kc-read-tag unread">未读</span>') + "</div>" +
      "<h2>" + esc(item.title) + "</h2>" +
      '<p class="kc-summary">' + esc(item.summary || "先读知识点，再去做任务；做完回来补常见坑。") + "</p>" +
      (points.length ? '<ul class="kc-points">' + points.map((p) => "<li>" + esc(p) + "</li>").join("") + "</ul>" : "") +
      '<div class="kc-foot"><span>' + icon("check") + (item.tasks ? item.tasks.length : day.tasks.length) + " 个任务关联</span><span>" + icon("note") + "知识库 · " + esc(item.file) + "</span></div></div>" +
      '<div class="kc-side"><button class="btn btn-primary" data-action="open-knowledge" data-day="' + day.id + '">' + icon("book") + "读完整笔记</button>" +
      '<button class="btn btn-sm ' + (read ? "btn-soft" : "") + '" data-action="toggle-knowledge-read" data-day="' + day.id + '">' + icon(read ? "check" : "plus") + (read ? "已读" : "标记已读") + "</button>" +
      '<span>含概念、代码、坑与面试口述</span></div></section>';
  }

  function openKnowledge(dayId) {
    const item = knowledgeForDay(dayId);
    if (!item) { toast("这一天的知识笔记还没生成"); return; }
    const all = KNOWLEDGE.weeks.flatMap((w) => w.days);
    const at = all.findIndex((x) => x.id === item.id);
    const prev = at > 0 ? all[at - 1] : null;
    const next = at >= 0 && at < all.length - 1 ? all[at + 1] : null;
    const read = isKnowledgeRead(item.id);
    const quick = getDayState(item.id).quick;
    openModal('<div class="modal-head knowledge-modal-head"><div><div class="eyebrow"><span class="line"></span>W' + pad2(item.week) + " · DAY " + item.day + " · KNOWLEDGE NOTE</div>" +
      "<h2>" + esc(item.title) + "</h2><p>" + esc(item.summary || "") + "</p></div>" +
      '<button class="icon-btn" data-action="modal-close" aria-label="关闭">' + icon("x") + "</button></div>" +
      '<div class="modal-body"><div class="knowledge-meta"><span class="chip chip-teal">' + icon("book") + "本地 Markdown</span><span class=\"chip\">" + esc(item.file) + "</span><span class=\"chip\">" + (item.tasks ? item.tasks.length : 0) + " 个任务关联</span>" +
      (read ? '<span class="chip chip-ok">' + icon("check") + "已读</span>" : '<span class="chip">未读</span>') + "</div>" +
      '<div class="knowledge-toolbar"><button class="btn btn-sm btn-accent" data-action="start-quiz" data-mode="quick" data-day="' + item.id + '">' + icon("quiz") + "随堂小测 · 3 题</button>" +
      '<button class="btn btn-sm ' + (read ? "btn-soft" : "") + '" data-action="toggle-knowledge-read" data-day="' + item.id + '">' + icon(read ? "check" : "plus") + (read ? "已读" : "标记已读") + "</button>" +
      '<span class="mono">' + (quick ? "上次 " + fmtPct(quick.best) + " · " + quick.attempts + " 次" : "读完立即测") + "</span></div>" +
      '<article class="knowledge-body">' + item.html + "</article>" +
      '<div class="knowledge-tasks"><b>' + icon("target") + "对应今日任务</b><ol>" + (item.tasks || []).map((t) => "<li>" + esc(t) + "</li>").join("") + "</ol></div></div>" +
      '<div class="knowledge-foot"><button class="btn btn-sm btn-soft" data-action="open-knowledge" data-day="' + (prev ? prev.id : "") + '" ' + (prev ? "" : "disabled") + ">" + icon("arrow-left") + "上一节</button>" +
      '<span class="mono">' + (at + 1) + " / " + all.length + "</span>" +
      '<button class="btn btn-sm btn-soft" data-action="open-knowledge" data-day="' + (next ? next.id : "") + '" ' + (next ? "" : "disabled") + ">下一节" + icon("arrow-right") + "</button></div>", "knowledge-modal");
  }

  function renderToday() {
    const idx = currentIndex();
    if (idx < 0) return renderPrep();
    if (isPlanOver()) return renderPost();
    return renderDay(PLAN.days[idx].id);
  }

  function renderPrep() {
    const start = state.settings.startDate;
    const wait = Math.max(0, daysBetween(todayStr(), start));
    const prepItems = [
      { id: "env", title: "装好 Python 工具链", note: "Python 3.11+、uv、Git；能跑 uv --version" },
      { id: "api", title: "准备一个模型 API", note: "DeepSeek / 通义 / OpenAI 兼容，先充最小额度" },
      { id: "time", title: "固定每天学习时段", note: "工作日 2.5h，周末 4h；写进日历" },
      { id: "baseline", title: "做一次基线自测", note: "W1 周测先做一遍，记录 0 基础分数" },
      { id: "repo", title: "建一个学习仓库", note: "每天 commit，README 记录进度" },
      { id: "read", title: "读完 PLAN.md", note: "知道 16 周怎么走、项目是什么" }
    ];
    const done = prepItems.filter((i) => state.prep[i.id]).length;
    const p = pct(done, prepItems.length);
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>PREP · 开营准备</div>' +
      "<h1>先把跑道铺好，再起飞。</h1><p>计划从 " + prettyDate(start) + " 开始。今天不用学新知识，用 30 分钟把环境、API 和学习节奏准备好。</p></div>" +
      '<div class="page-actions"><a class="btn btn-sm" href="#/quiz">' + icon("quiz") + "做基线自测</a>" +
      '<button class="btn btn-sm" data-action="open-settings">' + icon("settings") + "调整计划</button>" +
      '<button class="btn btn-sm btn-primary" data-action="start-now">' + icon("play") + "提前开始</button></div></div>" +
      '<div class="hero prep-hero" data-watermark="00"><div class="hero-grid"><div><div class="hero-kicker">' +
      '<span class="chip chip-accent">' + icon("clock") + "距开营 " + wait + " 天</span>" +
      '<span class="chip">' + icon("target") + esc(state.settings.targetRole) + "</span></div>" +
      '<h1 style="margin-top:16px">你的 16 周，从今天这个清单开始。</h1>' +
      '<p class="hero-focus">目标不是“学完课程”，而是 112 天后能独立设计、实现、评测并讲清一个 AI 应用系统。先把最小闭环跑起来。</p>' +
      '<div class="hero-meta"><span class="chip chip-teal">' + icon("check") + "准备进度 " + fmtPct(p) + "</span>" +
      '<span class="chip">' + icon("calendar") + "第 1 天 · " + prettyDate(start) + "</span></div></div>" +
      '<div class="hero-ring">' + ring(p, 132, fmtPct(p), "准备完成") + '<span>' + done + " / " + prepItems.length + " 项</span></div></div></div>" +
      '<div class="section-head"><h2>开营清单 <span>30 MIN</span></h2></div>' +
      '<div class="prep-grid">' + prepItems.map((it) =>
        '<div class="prep-item"><button class="task-check ' + (state.prep[it.id] ? "done" : "") + '" data-action="toggle-prep" data-id="' + it.id + '" aria-label="切换">' + icon("check") + "</button>" +
        '<div><b>' + esc(it.title) + "</b><span>" + esc(it.note) + "</span></div></div>"
      ).join("") + "</div>" +
      '<div class="section-head"><h2>第一周预览 <span>W1</span></h2><a class="link" href="#/roadmap">看完整路线' + icon("arrow-right") + "</a></div>" +
      '<div class="day-grid">' + (PLAN.weeks[0] ? PLAN.weeks[0].days.slice(0, 7).map(dayMini).join("") : "") + "</div>" +
      "</div>";
  }

  function renderPost() {
    const stats = allTaskStats();
    const avg = quizAverage();
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>AFTER · 计划之后</div>' +
      "<h1>112 天结束，求职才刚开始。</h1><p>计划完成了 " + fmtPct(stats.pct) + "。接下来用真实面试反馈迭代，持续投递，直到拿到 offer。</p></div>" +
      '<div class="page-actions"><a class="btn btn-sm" href="#/dashboard">' + icon("chart") + "查看看板</a>" +
      '<a class="btn btn-sm btn-primary" href="#/jobs">' + icon("briefcase") + "求职追踪</a></div></div>" +
      '<div class="stat-grid">' +
      statCard("连续学习", calcStreak(), "天", "保持每周节奏") +
      statCard("完成任务", stats.done, "/ " + stats.total, fmtPct(stats.pct) + " 完成率") +
      statCard("累计投入", Math.round(totalMinutes()), "分钟", "≈ " + (totalMinutes() / 60).toFixed(1) + " 小时") +
      statCard("测验均分", avg == null ? "—" : fmtPct(avg), "", "所有已测日") +
      "</div>" +
      '<div class="section-head"><h2>下一步</h2></div><div class="quiz-groups">' +
      '<div class="card quiz-group"><div class="qg-icon">' + icon("briefcase") + '</div><h3>继续投递</h3><p>每周 20 家定向投递，记录反馈，24 小时内复盘。</p><a class="btn btn-sm btn-primary" href="#/jobs">打开求职追踪</a></div>' +
      '<div class="card quiz-group"><div class="qg-icon teal">' + icon("review") + '</div><h3>保持手感</h3><p>每周 2 次算法、1 次项目复述、1 次模拟面试。</p><a class="btn btn-sm" href="#/review">去复习</a></div>' +
      '<div class="card quiz-group"><div class="qg-icon gold">' + icon("map") + '</div><h3>回看旅程</h3><p>复习项目故事和错题，准备行为面试。</p><a class="btn btn-sm" href="#/roadmap">打开路线图</a></div>' +
      "</div></div>";
  }

  function statCard(label, value, unit, sub) {
    return '<div class="card stat-card"><div class="sc-top"><span>' + esc(label) + "</span>" + icon("spark") + "</div>" +
      '<div class="sc-value">' + esc(value) + (unit ? "<small> " + esc(unit) + "</small>" : "") + "</div>" +
      '<div class="sc-sub">' + esc(sub || "") + "</div></div>";
  }

  function renderDay(id) {
    const day = PLAN.byId[id] || currentDay() || PLAN.days[0];
    if (!day) return '<div class="empty"><h3>还没有学习数据</h3></div>';
    const ds = getDayState(day.id);
    const prog = dayProgress(day);
    const qs = dayQuizStatus(day);
    const isToday = day.date === todayStr();
    const isPast = day.date < todayStr();
    const phase = day.phaseInfo;
    const isWeekly = day.day === 7;
    const quizName = isWeekly ? "本周周测" : "今日测验";
    const hasK = hasKnowledge(day);
    const kread = isKnowledgeRead(day.id);

    const tasksHtml = day.tasks.map((t, i) => {
      const done = taskDone(ds, i);
      return '<div class="task ' + (done ? "done" : "") + '">' +
        '<button class="task-check" data-action="toggle-task" data-day="' + day.id + '" data-task="' + i + '" aria-label="完成任务" aria-pressed="' + done + '">' + icon("check") + "</button>" +
        '<div class="task-body"><div class="task-top"><span class="task-type t-' + esc(t.type) + '">' + esc(t.type) + "</span>" +
        '<span class="task-text">' + esc(t.text) + "</span><span class=\"task-min\">" + t.minutes + "m</span></div></div></div>";
    }).join("");

    const rhythm = (() => {
      let acc = 0;
      return day.tasks.map((t, i) => {
        const from = acc; acc += t.minutes;
        const done = taskDone(ds, i);
        return '<div class="rhythm-row ' + (i === 0 && !done ? "active" : "") + '"><div class="rhythm-time">' + from + "–" + acc + "m</div>" +
          '<div class="rhythm-content"><b>' + esc(t.type) + " · " + t.minutes + " min</b><span>" + esc(t.text.slice(0, 36)) + (t.text.length > 36 ? "…" : "") + "</span></div></div>";
      }).join("");
    })();

    const notes = ds.notes;
    const oral = day.oral || { q: "", a: "", keywords: [] };
    const oralRating = ds.oral.rating || 0;

    const finishCopy = ds.completed
      ? "已完成今日学习 · " + (ds.completedAt ? timeAgo(ds.completedAt) : "")
      : (prog.all
        ? (hasK && !kread ? "任务完成，先读知识卡并标记已读" : "所有任务已完成，可以打卡了")
        : "还差 " + (prog.total - prog.done) + " 个任务，先完成最低线也可以");

    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>' +
      (isToday ? "TODAY" : (isPast ? "CATCH UP" : "PREVIEW")) + " · 第 " + day.week + " 周 · " + esc(phase.en) + "</div>" +
      "<h1>" + esc(day.title) + "</h1><p>" + esc(day.focus) + "</p></div>" + navArrows(day) + "</div>" +
      '<div class="hero" data-watermark="' + pad2(day.index + 1) + '"><div class="hero-grid"><div>' +
      '<div class="hero-kicker">' + phaseChip(day) + typeChip(day) + '<span class="chip">' + icon("calendar") + prettyDate(day.date) + " · " + day.weekday + "</span>" +
      (isToday ? '<span class="chip chip-accent">今天</span>' : "") + "</div>" +
      '<h1>' + esc(day.title) + "</h1>" +
      '<p class="hero-focus">' + esc(day.focus) + "</p>" +
      '<div class="hero-meta"><span class="chip">' + icon("clock") + day.minutes + " 分钟</span>" +
      '<span class="chip">' + icon("target") + "第 " + (day.index + 1) + " / " + PLAN.days.length + " 天</span>" +
      '<span class="chip chip-teal">' + icon("spark") + "产出：" + esc(day.deliverable) + "</span></div></div>" +
      '<div class="hero-ring">' + ring(prog.pct, 132, Math.round(prog.pct * 100) + "%", "任务完成") +
      '<span>' + prog.done + " / " + prog.total + " 个任务</span></div></div></div>" +
      knowledgeCard(day) +

      '<div class="today-grid"><div>' +
      '<section class="panel"><div class="panel-head"><h2>今日任务</h2><div style="display:flex;align-items:center;gap:10px"><button class="btn btn-sm btn-ghost" data-action="open-knowledge" data-day="' + day.id + '">' + icon("book") + "边做边看</button><div class=\"task-progress\"><div class=\"progress\"><span style=\"width:" + (prog.pct * 100) + '%"></span></div><b>' + prog.done + "/" + prog.total + "</b></div></div></div>" +
      '<div class="panel-body"><div class="task-list">' + tasksHtml + "</div></div></section>" +

      '<section class="panel" style="margin-top:16px"><div class="panel-head"><h2>3-2-1 复盘</h2><span class="meta">自动保存 · 写得越具体，复习越有用</span></div>' +
      '<div class="panel-body"><div class="notes-grid">' +
      noteField(day.id, "learned", "3 个知识点", "用自己的话写，不要复制", notes.learned) +
      noteField(day.id, "questions", "2 个疑问", "明天先解决哪一个？", notes.questions) +
      noteField(day.id, "action", "1 个行动", "明天能立刻用上的事", notes.action) +
      "</div>" +
      '<div class="oral-card"><div class="oral-head">' + icon("quiz") + "<b>面试口述题</b><span class=\"chip " + (oralRating >= 2 ? "chip-ok" : "") + "\">" + (oralRating === 2 ? "已掌握" : oralRating === 1 ? "答得不全" : oralRating === 0 && ds.oral.revealed ? "待加强" : "未作答") + "</span></div>" +
      '<div class="oral-body"><div class="oral-q">' + esc(oral.q || "今天的核心概念，用 60 秒讲一遍。") + "</div>" +
      '<div class="oral-answer ' + (ds.oral.revealed || oralRating ? "show" : "") + '"><b>参考要点：</b>' + esc(oral.a || "") + (oral.keywords && oral.keywords.length ? "<br><span class=\"small muted\">关键词：" + oral.keywords.map(esc).join(" · ") + "</span>" : "") + "</div>" +
      '<div class="oral-actions"><button class="btn btn-sm btn-soft" data-action="reveal-oral" data-day="' + day.id + '">' + icon("note") + (ds.oral.revealed ? "收起答案" : "查看参考答案") + "</button>" +
      '<div class="oral-rate ' + (ds.oral.revealed ? "show" : "") + '">' +
      '<button class="btn btn-sm ' + (oralRating === 0 && ds.oral.revealed ? "on" : "") + '" data-action="rate-oral" data-day="' + day.id + '" data-rating="0">没答上来</button>' +
      '<button class="btn btn-sm ' + (oralRating === 1 ? "on" : "") + '" data-action="rate-oral" data-day="' + day.id + '" data-rating="1">答得不全</button>' +
      '<button class="btn btn-sm ' + (oralRating === 2 ? "on" : "") + '" data-action="rate-oral" data-day="' + day.id + '" data-rating="2">讲清楚了</button>' +
      "</div></div></div></div>" +
      '<div class="finish-bar"><div class="finish-copy"><div class="finish-icon">' + icon(ds.completed ? "check" : "target") + "</div><div><b>" + esc(finishCopy) + "</b><span>" +
      (ds.quiz ? (isWeekly ? "周测最高 " : "测验最高 ") + fmtPct(ds.quiz.best) + (ds.quiz.best >= 0.8 ? " · 已通过" : " · 未达 80%") : "还没做" + quizName) +
      (hasK ? " · 知识卡" + (kread ? "已读" : "未读") : "") + "</span></div></div>" +
      (ds.completed
        ? '<button class="btn btn-sm btn-soft" data-action="start-quiz" data-mode="daily" data-day="' + day.id + '">' + icon("quiz") + "再测一次</button>"
        : '<button class="btn btn-sm btn-primary" data-action="complete-day" data-day="' + day.id + '" ' + (prog.done === 0 ? "disabled" : "") + ">" + icon("check") + "完成今日</button>") +
      "</div></div></section>" +
      "</div>" +
      '<aside class="sidebar-col">' +
      '<section class="panel"><div class="panel-head"><h2>今日节奏</h2><span class="meta">' + day.minutes + " min</span></div><div class=\"panel-body\"><div class=\"rhythm\">" + rhythm + "</div>" +
      '<div class="minimum-card"><h3>' + icon("target") + '最低完成线</h3><p>状态不好时：25 分钟核心概念 + 1 道测验 + 1 句话笔记。做了，就不算断签。</p></div></div></section>' +
      '<div class="timer-card" id="timer-card"><div class="timer-top"><span>FOCUS TIMER</span><span id="timer-state">' + (timer.running ? "RUNNING" : "READY") + '</span></div><div class="timer-display" id="timer-display">' + timerText() + '</div>' +
      '<div class="timer-actions"><button class="btn btn-sm btn-primary" data-action="timer-toggle" id="timer-toggle">' + (timer.running ? "暂停" : "开始 25 分钟") + '</button><button class="btn btn-sm" data-action="timer-reset">重置</button></div></div>' +
      '<section class="panel" style="margin-top:15px"><div class="panel-head"><h2>测验与复习</h2></div><div class="panel-body">' +
      '<div class="quiz-stat-row"><span>' + quizName + "</span><b>" + (qs.best == null ? "未开始" : fmtPct(qs.best)) + "</b></div>" +
      '<div class="quiz-stat-row"><span>通过线</span><b>80%</b></div>' +
      '<div class="quiz-stat-row"><span>到期复习</span><b>' + dueCards().length + " 张</b></div>" +
      '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:13px">' +
      '<button class="btn btn-sm ' + (qs.pass ? "btn-soft" : "btn-accent") + '" data-action="start-quiz" data-mode="daily" data-day="' + day.id + '">' + icon("quiz") + (qs.best == null ? "开始" + quizName : "再测一次") + "</button>" +
      '<a class="btn btn-sm btn-ghost" href="#/review">复习 ' + dueCards().length + "</a></div></div></section>" +
      "</aside></div></div>";
  }

  function noteField(dayId, key, title, hint, value) {
    return '<div class="note-field"><label><span><b>' + title + "</b> · " + hint + '</span><em data-count-for="' + dayId + "-" + key + '">' + String(value || "").length + "</em></label>" +
      '<textarea id="note-' + dayId + "-" + key + '" data-note="' + key + '" data-day="' + dayId + '" placeholder="' + hint + '">' + esc(value) + "</textarea></div>";
  }

  function dayMini(day) {
    const ds = state.days[day.id];
    const p = dayProgress(day);
    const done = ds && (ds.completed || p.all);
    const isToday = day.date === todayStr();
    return '<a class="day-mini ' + (done ? "done" : "") + " " + (isToday ? "today" : "") + '" href="#/day/' + day.id + '">' +
      '<div class="dm-top"><span class="dm-day">D' + day.day + "</span><span class=\"dm-status\"></span></div>" +
      "<b>" + esc(day.title) + "</b>" +
      '<span class="dm-type">' + esc(TYPE_LABEL[day.type] || "") + " · " + day.minutes + "m</span>" +
      '<span class="dm-date">' + shortDate(day.date) + "</span></a>";
  }

  /* ---------------- roadmap ---------------- */
  const openWeeks = new Set();
  function renderRoadmap() {
    const ci = currentIndex();
    if (!openWeeks.size) openWeeks.add(ci >= 0 ? PLAN.days[ci].week : 1);
    const stats = allTaskStats();
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>ROADMAP · 16 WEEKS</div>' +
      "<h1>路线图</h1><p>从 Python 迁移到 RAG、Agent、部署与求职。每周一个可验收的产出，别只看视频。</p></div>" +
      '<div class="page-actions"><span class="chip chip-teal">' + icon("check") + "总任务 " + fmtPct(stats.pct) + "</span>" +
      '<a class="btn btn-sm" href="#/dashboard">' + icon("chart") + "数据看板</a></div></div>" +
      '<div class="phase-strip">' + (META.phases || []).map((p) => {
        const pp = phaseProgress(p);
        return '<div class="phase-mini" style="--phase-color:' + p.color + '"><div class="pnum">P' + p.id + " · W" + p.weeks[0] + "–W" + p.weeks[1] + "</div><b>" + esc(p.name) + "</b><span>" + esc(p.desc) + '</span><div class="progress"><span style="width:' + (pp.pct * 100) + '%"></span></div></div>';
      }).join("") + "</div>" +
      '<div class="week-list">' + PLAN.weeks.map((w) => {
        const p = weekProgress(w);
        const open = openWeeks.has(w.week);
        return '<div class="week-card ' + (open ? "open" : "") + '" data-week-card="' + w.week + '">' +
          '<button class="week-summary" data-action="toggle-week" data-week="' + w.week + '">' +
          '<span class="week-badge"><b>' + w.week + "</b><span>WEEK</span></span>" +
          '<span class="week-main"><span class="wk-top">' + '<span class="chip" style="background:' + w.phaseInfo.color + '1a;color:' + w.phaseInfo.color + '">' + esc(w.phaseInfo.name) + "</span>" +
          '<h3>' + esc(w.theme) + "</h3></span><p>" + esc(w.goal) + "</p></span>" +
          '<span class="week-side"><span class="week-pct"><b>' + fmtPct(p.pct) + "</b><span>" + p.done + "/" + p.total + " 任务</span></span>" +
          '<span class="week-chevron">' + icon("chevron") + "</span></span></button>" +
          '<div class="week-detail"><div class="week-goal"><b>本周目标：</b>' + esc(w.goal) + "</div>" +
          '<div class="day-grid">' + w.days.map(dayMini).join("") + "</div>" +
          '<div class="week-knowledge"><div><b>本周知识笔记</b><span>7 节 · 概念、代码、常见坑与面试口述</span></div>' +
          '<button class="btn btn-sm" data-action="open-knowledge" data-day="w' + pad2(w.week) + 'd1">' + icon("book") + "打开 W" + pad2(w.week) + " 笔记</button></div>" +
          "</div></div>";
      }).join("") + "</div></div>";
  }

  /* ---------------- dashboard ---------------- */
  function renderDashboard() {
    const stats = allTaskStats();
    const avg = quizAverage();
    const qstats = quizAttemptStats();
    const streak = calcStreak();
    const ci = currentIndex();
    const days = PLAN.days;

    const heat = days.map((d) => {
      const ds = state.days[d.id] || {};
      const tasks = Object.values(ds.tasks || {}).filter(Boolean).length;
      const hasQuiz = ds.quiz ? 1 : 0;
      const hasNote = Object.values(ds.notes || {}).some((v) => String(v || "").trim()) ? 1 : 0;
      const hasRead = isKnowledgeRead(d.id) ? 1 : 0;
      const score = tasks + hasQuiz + hasNote + hasRead + (ds.completed ? 1 : 0);
      const level = score === 0 ? "" : score <= 2 ? "l1" : score <= 4 ? "l2" : score <= 6 ? "l3" : "l4";
      const future = d.date > todayStr() ? "future" : "";
      return '<div class="hm-cell ' + level + " " + future + '" title="' + d.date + " · " + tasks + "/" + d.tasks.length + " 任务 · " + (ds.minutes || 0) + ' 分钟" data-date="' + d.date + '"></div>';
    }).join("");

    const last7 = [];
    const start7 = clamp((ci >= 0 ? ci : 0) - 6, 0, Math.max(0, days.length - 7));
    for (let i = 0; i < 7; i++) {
      const d = days[start7 + i];
      if (d) last7.push(d);
    }
    const maxMin = Math.max(1, ...last7.map((d) => (state.days[d.id] && state.days[d.id].minutes) || 0));
    const bars = last7.map((d) => {
      const min = (state.days[d.id] && state.days[d.id].minutes) || 0;
      const h = Math.round((min / maxMin) * 100);
      return '<div class="bar-col"><b>' + (min || "") + '</b><div class="bar ' + (min ? "has" : "") + '" style="height:' + Math.max(4, h) + '%"></div><span>' + d.weekday.replace("周", "") + "</span></div>";
    }).join("");

    const weakMap = {};
    Object.keys(state.quiz).forEach((id) => {
      const s = state.quiz[id];
      const q = QUIZ_INDEX[id];
      if (!q || !s.wrong) return;
      if (!weakMap[q.topic]) weakMap[q.topic] = { wrong: 0, total: 0 };
      weakMap[q.topic].wrong += s.wrong;
      weakMap[q.topic].total += s.attempts || 0;
    });
    const weak = Object.keys(weakMap).map((k) => ({ topic: k, ...weakMap[k] })).sort((a, b) => b.wrong - a.wrong).slice(0, 5);

    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>DASHBOARD · 数据看板</div>' +
      "<h1>看见进度，才能坚持。</h1><p>任务、时长、测验和阶段进度都在这里。数据只存在本地浏览器，记得定期导出备份。</p></div>" +
      '<div class="page-actions"><button class="btn btn-sm" data-action="export-data">' + icon("download") + "导出备份</button>" +
      '<button class="btn btn-sm" data-action="open-settings">' + icon("settings") + "设置</button></div></div>" +

      '<div class="stat-grid">' +
      statCard("连续学习", streak, "天", "按有任务/笔记/测验计算") +
      statCard("完成任务", stats.done, "/ " + stats.total, "完成率 " + fmtPct(stats.pct)) +
      statCard("累计投入", Math.round(totalMinutes()), "分钟", "≈ " + (totalMinutes() / 60).toFixed(1) + " 小时") +
      statCard("测验均分", avg == null ? "—" : fmtPct(avg), "", "答题正确率 " + fmtPct(qstats.accuracy)) +
      "</div>" +

      '<div class="dash-grid"><div>' +
      '<section class="panel"><div class="panel-head"><h2>16 周热力图</h2><span class="meta">越深 = 当天投入越多</span></div><div class="panel-body"><div class="heatmap-wrap"><div class="heatmap">' + heat + "</div></div>" +
      '<div class="hm-legend"><span>少</span><span class="hm-cell"></span><span class="hm-cell l1"></span><span class="hm-cell l2"></span><span class="hm-cell l3"></span><span class="hm-cell l4"></span><span>多</span></div></div></section>' +
      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>近 7 天投入</h2><span class="meta">分钟</span></div><div class="panel-body"><div class="bars">' + bars + "</div></div></section>" +
      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>阶段进度</h2><span class="meta">' + stats.done + " / " + stats.total + " 任务</span></div><div class=\"panel-body\"><div class=\"phase-progress-list\">" +
      (META.phases || []).map((p) => {
        const pp = phaseProgress(p);
        return '<div class="phase-progress-row" style="--phase-color:' + p.color + '"><div class="pp-top"><b>' + esc(p.name) + "</b><span>" + fmtPct(pp.pct) + "</span></div><div class=\"progress\"><span style=\"width:" + (pp.pct * 100) + '%"></span></div></div>';
      }).join("") + "</div></div></section>" +
      "</div><div>" +
      '<section class="panel"><div class="panel-head"><h2>下一步建议</h2></div><div class="panel-body">' +
      nextStepHtml() + "</div></section>" +
      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>薄弱主题</h2><span class="meta">按错题数</span></div><div class="panel-body">' +
      (weak.length ? weak.map((w) => '<div class="quiz-stat-row"><span>' + esc(w.topic) + "</span><b>" + w.wrong + " 错 / " + w.total + " 次</b></div>").join("") : '<p class="small muted">还没有错题。先去做一次测验。</p>') +
      "</div></section>" +
      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>每周任务完成</h2></div><div class="panel-body"><div class="week-bars">' +
      PLAN.weeks.map((w) => {
        const p = weekProgress(w);
        return '<div class="week-bar-row"><span>W' + w.week + '</span><div class="progress"><span style="width:' + (p.pct * 100) + '%"></span></div><b>' + Math.round(p.pct * 100) + "%</b></div>";
      }).join("") + "</div></div></section>" +
      "</div></div></div>";
  }

  function nextStepHtml() {
    const ci = currentIndex();
    if (ci < 0) return '<p class="small muted">计划还没开始。先去「今日」完成开营准备。</p><a class="btn btn-sm btn-primary" href="#/today">去准备</a>';
    const day = PLAN.days[ci];
    const ds = state.days[day.id];
    const due = dueCards().length;
    const wrong = wrongQuestions().length;
    let html = '<div class="quiz-stat-row"><span>当前</span><b>' + esc(day.id) + "</b></div>";
    html += '<div class="quiz-stat-row"><span>今日主题</span><b style="max-width:190px;text-align:right;font-family:var(--sans);font-size:11px">' + esc(day.title) + "</b></div>";
    html += '<div class="quiz-stat-row"><span>到期复习</span><b>' + due + " 张</b></div>";
    html += '<div class="quiz-stat-row"><span>知识卡已读</span><b>' + Object.keys(state.knowledgeRead).filter((id) => KNOWLEDGE.byDay[id]).length + " / " + Object.keys(KNOWLEDGE.byDay).length + "</b></div>";
    html += '<div class="quiz-stat-row"><span>待重练错题</span><b>' + wrong + " 道</b></div>";
    html += '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:13px"><a class="btn btn-sm btn-primary" href="#/today">继续今日</a>';
    if (due) html += '<a class="btn btn-sm" href="#/review">去复习</a>';
    if (wrong) html += '<a class="btn btn-sm" href="#/quiz">练错题</a>';
    html += "</div>";
    if (!ds || !ds.completed) html += '<p class="small muted" style="margin-top:11px">今天还没打卡。先完成一个任务，别让连续记录断掉。</p>';
    return html;
  }

  /* ---------------- timer ---------------- */
  const timer = { remaining: 25 * 60, running: false, endAt: 0, handle: null, dayId: null };
  function timerText() {
    const m = Math.floor(timer.remaining / 60);
    const s = timer.remaining % 60;
    return pad2(m) + ":" + pad2(s);
  }
  function paintTimer() {
    const d = $("#timer-display");
    if (d) d.textContent = timerText();
    const st = $("#timer-state");
    if (st) st.textContent = timer.running ? "RUNNING" : (timer.remaining === 1500 ? "READY" : "PAUSED");
    const b = $("#timer-toggle");
    if (b) b.textContent = timer.running ? "暂停" : "开始 25 分钟";
  }
  function startTimer(dayId) {
    if (timer.running) return;
    if (timer.remaining <= 0) timer.remaining = 25 * 60;
    timer.dayId = dayId || (currentDay() && currentDay().id);
    timer.endAt = Date.now() + timer.remaining * 1000;
    timer.running = true;
    clearInterval(timer.handle);
    timer.handle = setInterval(() => {
      timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
      paintTimer();
      if (timer.remaining <= 0) {
        clearInterval(timer.handle);
        timer.running = false;
        timer.remaining = 25 * 60;
        if (timer.dayId) {
          const ds = getDayState(timer.dayId);
          ds.minutes = (ds.minutes || 0) + 25;
          ds.lastActiveAt = new Date().toISOString();
          saveState(true);
        }
        paintTimer();
        toast("完成一个 25 分钟专注段，已计入今日投入");
        celebrate();
      }
    }, 400);
  }
  function pauseTimer() {
    if (!timer.running) return;
    timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
    timer.running = false;
    clearInterval(timer.handle);
    paintTimer();
  }

  /* ---------------- quiz hub ---------------- */
  function renderQuizHub() {
    const day = currentDay() || PLAN.days[0];
    const qs = dayQuizStatus(day);
    const stats = quizAttemptStats();
    const wrong = wrongQuestions();
    const avg = quizAverage();
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>QUIZ · 每日测验</div>' +
      "<h1>用输出检验输入。</h1><p>每天 2 道选择题 + 1 道口述题。错题会自动进入复习队列，周测覆盖当周全部主题。</p></div>" +
      '<div class="page-actions"><span class="chip chip-teal">' + icon("check") + "平均正确率 " + fmtPct(stats.accuracy) + "</span>" +
      '<button class="btn btn-sm" data-action="start-quiz" data-mode="random">' + icon("spark") + "随机 10 题</button></div></div>" +

      '<div class="quiz-hero"><div class="quiz-hero-main"><div class="hero-kicker"><span class="chip chip-accent">' + icon("calendar") + prettyDate(day.date) + " · " + esc(day.title) + "</span></div>" +
      "<h2>" + (qs.pass ? "今日已通过，保持手感。" : "今天，敢不敢测一下？") + "</h2>" +
      "<p>" + (qs.best == null ? "别等“学完再测”。先做一遍，暴露盲点，再回去补，效率更高。" : "最高分 " + fmtPct(qs.best) + "。低于 80% 就重练错题，不要只看解析。") + "</p>" +
      '<div class="actions"><button class="btn btn-primary" data-action="start-quiz" data-mode="daily" data-day="' + day.id + '">' + icon("quiz") + (qs.best == null ? "开始今日测验" : "再测一次") + "</button>" +
      '<a class="btn btn-soft" href="#/review">' + icon("review") + "去复习 " + dueCards().length + " 张卡</a></div></div>" +
      '<div class="quiz-hero-side"><div class="quiz-stat-row"><span>今日测验</span><b>' + (qs.best == null ? "未开始" : fmtPct(qs.best)) + "</b></div>" +
      '<div class="quiz-stat-row"><span>累计答题</span><b>' + stats.attempts + " 次</b></div>" +
      '<div class="quiz-stat-row"><span>平均正确率</span><b>' + fmtPct(stats.accuracy) + "</b></div>" +
      '<div class="quiz-stat-row"><span>待重练错题</span><b>' + wrong.length + " 道</b></div>" +
      '<div class="quiz-stat-row"><span>已测日均分</span><b>' + (avg == null ? "—" : fmtPct(avg)) + "</b></div></div></div>" +

      '<div class="quiz-groups">' +
      '<div class="card quiz-group"><div class="qg-icon">' + icon("quiz") + "</div><h3>每日测验</h3><p>2 道选择题 + 1 道口述题，3 分钟。及格线 80%。</p>" +
      '<button class="btn btn-sm btn-primary" data-action="start-quiz" data-mode="daily" data-day="' + day.id + '">开始</button></div>' +
      '<div class="card quiz-group"><div class="qg-icon teal">' + icon("calendar") + "</div><h3>周测</h3><p>10 道选择题 + 2 道口述题，覆盖本周所有主题。</p>" +
      '<button class="btn btn-sm" data-action="start-quiz" data-mode="weekly" data-week="' + day.week + '">测 W' + day.week + "</button></div>" +
      '<div class="card quiz-group"><div class="qg-icon gold">' + icon("review") + "</div><h3>错题重练</h3><p>只练做错且未掌握的题，连续答对 2 次才算掌握。</p>" +
      '<button class="btn btn-sm" data-action="start-quiz" data-mode="wrong" ' + (wrong.length ? "" : "disabled") + ">重练 " + wrong.length + " 题</button></div></div>" +

      '<div class="section-head"><h2>周测入口 <span>16 WEEKS</span></h2><span class="meta">建议每周日完成</span></div>' +
      '<div class="phase-strip">' + PLAN.weeks.map((w) => {
        const p = weekProgress(w);
        return '<button class="phase-mini" style="--phase-color:' + w.phaseInfo.color + ';text-align:left;cursor:pointer" data-action="start-quiz" data-mode="weekly" data-week="' + w.week + '">' +
          '<div class="pnum">W' + w.week + " · " + w.phaseInfo.name + "</div><b>" + esc(w.theme) + '</b><span>' + fmtPct(p.pct) + ' 完成</span><div class="progress"><span style="width:' + (p.pct * 100) + '%"></span></div></button>';
      }).join("") + "</div>" +

      '<div class="section-head"><h2>错题本 <span>' + wrong.length + "</span></h2><button class=\"btn btn-sm btn-ghost\" data-action=\"start-quiz\" data-mode=\"wrong\" " + (wrong.length ? "" : "disabled") + ">全部重练</button></div>" +
      '<section class="panel"><div class="panel-body"><div class="wrong-list">' +
      (wrong.length ? wrong.slice(0, 8).map((q) => '<div class="wrong-row"><span class="qmark">Q</span><p>' + esc(q.q) + '</p><span>W' + q.week + " · " + esc(q.topic) + "</span></div>").join("") : '<p class="small muted">还没有错题。做完测验后，错题会自动出现在这里。</p>') +
      "</div></div></section></div>";
  }

  /* ---------------- quiz runner ---------------- */
  let quizSession = null;
  let reviewRevealed = false;

  function startQuiz(mode, opts) {
    opts = opts || {};
    const items = [];
    let title = "测验";
    let dayId = null;
    if (mode === "quick") {
      const day = PLAN.byId[opts.day] || currentDay() || PLAN.days[0];
      if (!day) return;
      dayId = day.id;
      title = "随堂小测 · " + day.id;
      items.push(...quickQuizItemsForDay(day));
    } else if (mode === "daily") {
      const day = PLAN.byId[opts.day] || currentDay() || PLAN.days[0];
      if (!day) return;
      dayId = day.id;
      title = "每日测验 · " + day.id;
      items.push(...quizItemsForDay(day));
    } else if (mode === "weekly") {
      const weekNo = Number(opts.week) || (currentDay() ? currentDay().week : 1);
      const week = weekForNumber(weekNo);
      if (!week) return;
      dayId = week.days[6] ? week.days[6].id : null;
      title = "W" + weekNo + " 周测";
      items.push(...weeklyItems(weekNo));
    } else if (mode === "wrong") {
      title = "错题重练";
      items.push(...wrongQuestions().slice(0, 20).map(mcqItem));
    } else if (mode === "random") {
      title = "随机 10 题";
      items.push(...seededShuffle(QUIZ, Date.now() % 100000).slice(0, 10).map(mcqItem));
    }
    if (!items.length) { toast("暂时没有可用的题目"); return; }
    startQuizWithItems(items, title, dayId, mode);
  }

  function startQuizWithItems(items, title, dayId, mode) {
    quizSession = {
      items, title, dayId, mode: mode || "custom", index: 0, finished: false, saved: false,
      startedAt: Date.now(), selected: null, showRef: false,
      answers: items.map((it) => it.kind === "mcq"
        ? { kind: "mcq", item: it, selected: null, submitted: false, correct: null, score: 0 }
        : { kind: "oral", item: it, text: "", rating: null, submitted: false, score: 0 })
    };
    openModal(quizShell(title), "quiz-modal");
    paintQuiz();
  }

  function quizShell(title) {
    return '<div class="quiz-top"><div class="quiz-progress"><div class="progress"><span id="quiz-bar" style="width:0%"></span></div><b id="quiz-count">0 / 0</b></div>' +
      '<button class="icon-btn" data-action="quiz-close" aria-label="关闭">' + icon("x") + "</button></div>" +
      '<div id="quiz-stage"></div>';
  }

  function paintQuiz() {
    if (!quizSession) return;
    const stage = $("#quiz-stage");
    if (!stage) return;
    const s = quizSession;
    const bar = $("#quiz-bar");
    const count = $("#quiz-count");
    if (bar) bar.style.width = (pct(s.index + 1, s.items.length) * 100) + "%";
    if (count) count.textContent = Math.min(s.index + 1, s.items.length) + " / " + s.items.length;
    if (s.finished) { stage.innerHTML = quizResultHtml(); return; }
    const item = s.items[s.index];
    const ans = s.answers[s.index];
    if (!item || !ans) return;

    if (item.kind === "mcq") {
      stage.innerHTML = '<div class="quiz-body">' +
        '<div class="quiz-topic"><span class="chip chip-accent">W' + item.week + " · D" + item.day + '</span><span class="chip">' + esc(item.topic) + '</span><span class="chip">单选</span></div>' +
        '<div class="quiz-q">' + esc(item.q) + "</div>" +
        '<div class="quiz-hint">选择一个最准确的答案。提交后会显示解析。</div>' +
        '<div class="options">' + item.options.map((o, i) => {
          let cls = "option";
          if (ans.submitted) {
            if (i === item.answer) cls += " correct";
            else if (i === ans.selected) cls += " wrong";
          } else if (i === s.selected) cls += " selected";
          const mark = ans.submitted && i === item.answer ? '<span class="opt-mark">正确</span>' : (ans.submitted && i === ans.selected && i !== item.answer ? '<span class="opt-mark">你的选择</span>' : "");
          return '<button class="' + cls + '" data-action="quiz-select" data-index="' + i + '" ' + (ans.submitted ? "disabled" : "") + '><span class="key">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span>" + mark + "</button>";
        }).join("") + "</div>" +
        (ans.submitted ? '<div class="feedback ' + (ans.correct ? "" : "bad") + '"><b class="' + (ans.correct ? "ok" : "no") + '">' + (ans.correct ? "回答正确" : "回答错误，正确答案是 " + "ABCD"[item.answer]) + "</b>" + esc(item.explain) + "</div>" : "") +
        "</div>" +
        '<div class="quiz-footer"><button class="btn btn-ghost" data-action="quiz-close">退出</button><span class="kbd">1–4 选择 · Enter 确认</span>' +
        (ans.submitted
          ? '<button class="btn btn-primary" data-action="quiz-next">' + (s.index === s.items.length - 1 ? "查看结果" : "下一题") + " " + icon("arrow-right") + "</button>"
          : '<button class="btn btn-primary" data-action="quiz-submit" ' + (s.selected == null ? "disabled" : "") + ">提交答案</button>") +
        "</div>";
    } else {
      const rating = ans.rating;
      stage.innerHTML = '<div class="quiz-body">' +
        '<div class="quiz-topic"><span class="chip chip-teal">W' + item.week + " · D" + item.day + '</span><span class="chip">口述题</span><span class="chip">自评</span></div>' +
        '<div class="quiz-q">' + esc(item.q) + "</div>" +
        '<div class="quiz-hint">先在心里或纸上回答，再看参考要点。不要一上来就看答案。</div>' +
        '<div class="oral-prompt"><textarea data-oral-text placeholder="写下你的回答关键词（可选）..." ' + (ans.submitted ? "disabled" : "") + ">" + esc(ans.text || "") + "</textarea></div>" +
        '<div class="reference ' + (s.showRef || ans.submitted ? "show" : "") + '"><b>参考要点：</b>' + esc(item.answer) + (item.keywords && item.keywords.length ? '<br><span class="small muted">关键词：' + item.keywords.map(esc).join(" · ") + "</span>" : "") + "</div>" +
        (ans.submitted ? '<div class="feedback"><b class="ok">已记录自评：' + ["没答上来", "答得不全", "讲清楚了"][rating] + "</b>这道题已加入复习队列，之后会再出现。</div>" : "") +
        "</div>" +
        '<div class="quiz-footer"><button class="btn btn-ghost" data-action="quiz-close">退出</button>' +
        (ans.submitted
          ? '<button class="btn btn-primary" data-action="quiz-next">' + (s.index === s.items.length - 1 ? "查看结果" : "下一题") + " " + icon("arrow-right") + "</button>"
          : '<button class="btn btn-soft" data-action="quiz-reveal-ref">' + icon("note") + "查看参考答案</button>" +
            '<div class="self-rate"><button class="btn btn-sm" data-action="quiz-rate" data-rating="0">没答上来</button><button class="btn btn-sm" data-action="quiz-rate" data-rating="1">答得不全</button><button class="btn btn-sm btn-accent" data-action="quiz-rate" data-rating="2">讲清楚了</button></div>') +
        "</div>";
    }
  }

  function quizScore() {
    if (!quizSession) return { earned: 0, total: 0, p: 0 };
    const total = quizSession.items.length;
    const earned = quizSession.answers.reduce((n, a) => n + (a.kind === "mcq" ? (a.correct ? 1 : 0) : (a.score || 0)), 0);
    return { earned, total, p: total ? earned / total : 0 };
  }

  function quizResultHtml() {
    const { earned, total, p } = quizScore();
    const isQuick = quizSession.mode === "quick";
    const pass = p >= (isQuick ? 2 / 3 - 1e-9 : 0.8);
    const mcq = quizSession.answers.filter((a) => a.kind === "mcq");
    const oral = quizSession.answers.filter((a) => a.kind === "oral");
    const correct = mcq.filter((a) => a.correct).length;
    const wrong = quizSession.answers.filter((a) => (a.kind === "mcq" && !a.correct) || (a.kind === "oral" && a.rating < 2));
    const minutes = Math.max(1, Math.round((Date.now() - quizSession.startedAt) / 60000));
    const statsHtml = isQuick
      ? '<div class="result-stats"><div><b>' + correct + "/" + mcq.length + "</b><span>选择题</span></div><div><b>" + minutes + "m</b><span>用时</span></div><div><b>" + earned + "/" + total + "</b><span>总得分</span></div></div>"
      : '<div class="result-stats"><div><b>' + correct + "/" + mcq.length + "</b><span>选择题</span></div><div><b>" + (oral.length ? (oral.reduce((n, a) => n + (a.score || 0), 0)).toFixed(1) + "/" + oral.length : "—") + "</b><span>口述得分</span></div><div><b>" + minutes + "m</b><span>用时</span></div><div><b>" + earned + "/" + total + "</b><span>总得分</span></div></div>";
    return '<div class="result">' + ring(p, 132, Math.round(p * 100) + "%", pass ? "PASS" : "RETRY") +
      "<h2>" + (pass ? (isQuick ? "随堂测通过，已标记已读。" : "过了，但别急着走。") : (isQuick ? "再对一道就通过。" : "没过 80%，正好知道该补哪。")) + "</h2>" +
      "<p>" + (pass
        ? (isQuick ? "这道知识卡已经进入“已读”，可以去做任务了。" : "把刚才不确定的题再看一遍解析，然后去复习队列里清掉到期卡片。")
        : (isQuick ? "答对 2 题即可通过；先看解析，再点“重练错题”。" : "先看错题解析，再点“重练错题”。连续答对 2 次，系统才会标记为掌握。")) + "</p>" +
      statsHtml +
      '<div class="actions"><button class="btn btn-soft" data-action="quiz-close">' + icon("check") + "完成" + "</button>" +
      (wrong.length ? '<button class="btn btn-primary" data-action="quiz-retry-wrong">' + icon("review") + "重练错题 (" + wrong.length + ")" + "</button>" : "") +
      '<button class="btn btn-ghost" data-action="quiz-retry">再测一次</button></div>' +
      (wrong.length ? '<div class="review-list"><div class="section-head" style="margin:18px 0 4px"><h2 style="font-size:13px">需要回看</h2></div>' +
        wrong.map((a) => {
          if (a.kind === "mcq") return '<div class="review-item"><div class="ri-q">' + esc(a.item.q) + '</div><div class="ri-a">正确答案：' + esc(a.item.options[a.item.answer]) + "。" + esc(a.item.explain) + "</div></div>";
          return '<div class="review-item"><div class="ri-q">' + esc(a.item.q) + '</div><div class="ri-a">参考要点：' + esc(a.item.answer) + "</div></div>";
        }).join("") + "</div>" : "") +
      "</div>";
  }

  function finishQuiz() {
    if (!quizSession) return;
    quizSession.finished = true;
    recordQuizResult();
    paintQuiz();
  }

  function recordQuizResult() {
    if (!quizSession || quizSession.saved) return;
    quizSession.saved = true;
    const { earned, total, p } = quizScore();
    const now = new Date().toISOString();
    const s = quizSession;

    if (s.dayId) {
      const ds = getDayState(s.dayId);
      const prev = (s.mode === "quick" ? ds.quick : ds.quiz) || { best: 0, attempts: 0 };
      const result = {
        best: Math.max(prev.best || 0, p),
        last: p,
        attempts: (prev.attempts || 0) + 1,
        at: now,
        total,
        score: earned
      };
      if (s.mode === "quick") {
        ds.quick = result;
        if (p >= 2 / 3 - 1e-9) markKnowledgeRead(s.dayId, true);
      } else {
        ds.quiz = result;
      }
      ds.lastActiveAt = now;
    }

    s.answers.forEach((a) => {
      if (a.kind !== "mcq") return;
      const q = a.item;
      const prev = state.quiz[q.id] || { attempts: 0, correct: 0, wrong: 0, streak: 0, mastered: false };
      prev.attempts += 1;
      if (a.correct) {
        prev.correct += 1;
        prev.streak = (prev.streak || 0) + 1;
        prev.lastCorrect = true;
      } else {
        prev.wrong += 1;
        prev.streak = 0;
        prev.lastCorrect = false;
        const source = QUIZ_INDEX[q.id];
        if (source) {
          addCard("mcq-" + q.id, {
            type: "mcq",
            front: source.q,
            back: "正确答案：" + source.options[source.answer] + "。" + (source.explain || ""),
            ref: { week: source.week, day: source.day }
          });
        }
      }
      prev.mastered = (prev.streak || 0) >= 2;
      prev.lastAt = now;
      state.quiz[q.id] = prev;
      const card = state.cards["mcq-" + q.id];
      if (card && prev.mastered) card.suspended = true;
      if (card && !a.correct) card.suspended = false;
    });

    s.answers.forEach((a) => {
      if (a.kind !== "oral") return;
      const item = a.item;
      if (!item.dayId) return;
      const id = "oral-" + item.dayId;
      addCard(id, { type: "oral", front: item.q, back: item.answer, ref: { week: item.week, day: item.day } });
      const card = state.cards[id];
      card.lastRating = a.rating;
      if (a.rating >= 2) card.due = addDays(todayStr(), 2);
      else if (a.rating === 1) card.due = todayStr();
      else card.due = todayStr();
    });

    saveState();
  }

  function retryWrong() {
    if (!quizSession) return;
    const wrong = quizSession.answers.filter((a) => (a.kind === "mcq" && !a.correct) || (a.kind === "oral" && a.rating < 2)).map((a) => ({
      ...a.item,
      kind: a.kind
    }));
    if (!wrong.length) { toast("没有需要重练的题"); return; }
    startQuizWithItems(wrong, "错题重练", quizSession.mode === "quick" ? quizSession.dayId : null, quizSession.mode);
  }

  /* ---------------- review ---------------- */
  function schedulePreview(card, rating) {
    const ease = card.ease || 2.5;
    const base = card.interval || 0;
    if (rating === 0) return 1;
    if (base <= 0) return rating === 3 ? 2 : 1;
    if (base === 1) return rating === 1 ? 2 : rating === 2 ? 3 : 4;
    const mul = rating === 1 ? 1.2 : rating === 3 ? 1.5 : ease;
    return Math.max(1, Math.round(base * mul));
  }

  function scheduleCard(card, rating) {
    const today = todayStr();
    if (rating === 0) {
      card.interval = 1;
      card.ease = Math.max(1.3, (card.ease || 2.5) - 0.2);
      card.lapses = (card.lapses || 0) + 1;
    } else {
      card.interval = schedulePreview(card, rating);
      card.ease = Math.max(1.3, (card.ease || 2.5) + (rating === 3 ? 0.15 : rating === 1 ? -0.15 : 0));
    }
    card.reps = (card.reps || 0) + 1;
    card.last = today;
    card.lastRating = rating;
    card.due = addDays(today, card.interval);
  }

  function renderReview() {
    const due = dueCards();
    const all = allCards();
    const card = due[0];
    const mastered = all.filter((c) => (c.interval || 0) >= 21).length;
    const todayGenerated = all.filter((c) => c.created === todayStr()).length;
    const day = currentDay();
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>REVIEW · 间隔复习</div>' +
      "<h1>记住，而不是看过。</h1><p>口述题和错题会进入复习队列。先回忆，再看答案，然后诚实自评。</p></div>" +
      '<div class="page-actions"><span class="chip chip-teal">' + icon("review") + "今日到期 " + due.length + "</span>" +
      (day && day.oral ? '<button class="btn btn-sm" data-action="generate-oral-card" data-day="' + day.id + '">' + icon("plus") + "生成今日口述卡</button>" : "") + "</div></div>" +
      '<div class="review-layout"><div>' +
      '<section class="panel review-stage">' +
      (card ? '<div class="flashcard ' + (reviewRevealed ? "revealed" : "") + '"><span class="fc-label">' + (card.type === "oral" ? "ORAL CARD" : "WRONG QUESTION") + (card.ref ? " · W" + card.ref.week + " D" + card.ref.day : "") + '</span><div class="fc-q">' + esc(card.front) + '</div><div class="fc-back">' + esc(card.back) + "</div>" +
        '<div class="fc-hint">' + (reviewRevealed ? "诚实评价：想不起来就点“重来”，别骗自己。" : "先在心里回答，再翻面。") + "</div></div>" +
        '<div class="fc-actions">' + (reviewRevealed
          ? [0, 1, 2, 3].map((r) => '<button class="btn ' + ["again", "hard", "good", "easy"][r] + '" data-action="rate-card" data-id="' + card.id + '" data-rating="' + r + '">' + ["重来", "模糊", "记住", "简单"][r] + '<span class="tiny muted"> ' + schedulePreview(card, r) + "d</span></button>").join("")
          : '<button class="btn btn-primary" data-action="reveal-card">' + icon("note") + "翻面看答案</button>") + "</div>"
        : '<div class="empty"><div class="empty-icon">' + icon("check") + "</div><h3>今天的卡清完了</h3><p>到期队列是空的。可以去学今天的内容，或者提前复习已生成的卡片。</p><a class=\"btn btn-sm btn-primary\" href=\"#/today\">回到今日</a></div>") +
      "</section>" +
      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>复习队列</h2><span class="meta">' + due.length + " 张到期</span></div><div class=\"panel-body\">" +
      (due.length > 1 ? due.slice(1, 6).map((c) => '<div class="quiz-stat-row"><span style="max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(c.front) + "</span><b>" + (c.type === "oral" ? "口述" : "错题") + "</b></div>").join("") : '<p class="small muted">' + (due.length ? "这是最后一张。" : "暂无到期卡片。") + "</p>") +
      "</div></section></div>" +
      '<aside class="review-side"><section class="panel"><div class="panel-head"><h2>复习统计</h2></div><div class="panel-body">' +
      '<div class="stat-line"><span>到期</span><b>' + due.length + "</b></div>" +
      '<div class="stat-line"><span>全部卡片</span><b>' + all.length + "</b></div>" +
      '<div class="stat-line"><span>已掌握</span><b>' + mastered + "</b></div>" +
      '<div class="stat-line"><span>今日新增</span><b>' + todayGenerated + "</b></div>" +
      '<p class="small muted" style="margin-top:12px">连续答对 2 次的选择题会被标记为掌握；口述题自评“讲清楚了”会拉长复习间隔。</p></div></section>' +
      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>搜索笔记</h2></div><div class="panel-body"><div class="search-box">' + icon("quiz") + '<input type="search" data-note-search placeholder="搜知识点、卡点、项目..." /></div><div id="note-results" class="note-search-results"></div></div></section>' +
      "</aside></div></div>";
  }

  function renderNoteResults(q) {
    const box = $("#note-results");
    if (!box) return;
    const query = String(q || "").trim().toLowerCase();
    if (!query) { box.innerHTML = '<p class="small muted" style="margin-top:8px">输入关键词，搜索 112 天里的笔记。</p>'; return; }
    const results = [];
    PLAN.days.forEach((d) => {
      const ds = state.days[d.id];
      if (!ds || !ds.notes) return;
      const text = [ds.notes.learned, ds.notes.questions, ds.notes.action].filter(Boolean).join(" · ");
      if (text.toLowerCase().includes(query)) results.push({ day: d, text });
    });
    if (!results.length) { box.innerHTML = '<p class="small muted" style="margin-top:8px">没有找到。换个关键词试试。</p>'; return; }
    box.innerHTML = results.slice(0, 8).map((r) => {
      const idx = r.text.toLowerCase().indexOf(query);
      const snippet = r.text.slice(Math.max(0, idx - 20), idx + 90);
      return '<a class="note-result" href="#/day/' + r.day.id + '"><b>' + r.day.id + " · " + esc(r.day.title) + "</b><p>…" + esc(snippet) + "…</p></a>";
    }).join("");
  }

  /* ---------------- jobs ---------------- */
  const STAGES = ["已投递", "沟通中", "一面", "二面", "三面", "HR 面", "Offer", "已拒绝"];
  const interviewOpen = new Set();

  function readinessScore() {
    const checks = META.checklist || [];
    const checkDone = checks.filter((c) => state.checklists[c.id]).length;
    const specs = META.projectSpecs || [];
    const filled = specs.filter((p) => {
      const s = state.stories[p.id] || {};
      return ["background", "task", "action", "result", "tradeoff"].filter((k) => String(s[k] || "").trim()).length >= 4;
    }).length;
    const apps = state.applications.length;
    return Math.round(pct(checkDone, checks.length) * 55 + pct(filled, specs.length) * 25 + pct(Math.min(apps, 10), 10) * 20);
  }

  function renderJobs() {
    const score = readinessScore();
    const checks = META.checklist || [];
    const checkDone = checks.filter((c) => state.checklists[c.id]).length;
    const specs = META.projectSpecs || [];
    const apps = state.applications;
    const cats = Array.from(new Set(INTERVIEW.map((q) => q.cat)));
    const mastered = INTERVIEW.filter((q, i) => state.interviewMastered[i]).length;
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>CAREER · 求职作战</div>' +
      "<h1>把能力，翻译成 offer。</h1><p>简历、项目故事、投递记录和面试题都在这里。每完成一项， readiness 就涨一点。</p></div>" +
      '<div class="page-actions"><button class="btn btn-sm btn-primary" data-action="add-app">' + icon("plus") + "记录投递</button>" +
      '<button class="btn btn-sm" data-action="open-settings">' + icon("settings") + "设置</button></div></div>" +

      '<div class="jobs-grid"><div>' +
      '<section class="panel"><div class="panel-head"><h2>求职就绪度</h2><span class="meta">' + checkDone + "/" + checks.length + " 清单 · " + apps.length + " 投递</span></div><div class=\"panel-body\"><div class=\"readiness\">" +
      ring(score / 100, 112, score + "%", "READY") +
      "<div><h3>" + (score >= 80 ? "可以主动出击了" : score >= 55 ? "接近可投递，先补短板" : "先把作品和故事补齐") + "</h3>" +
      "<p>就绪度 = 清单 55% + 三个项目故事 25% + 投递 20%。它不是能力评分，而是提醒你哪块还没做。</p>" +
      '<div class="data-actions" style="margin-top:10px"><a class="btn btn-sm" href="#/library" data-tab="projects">看项目规格</a><a class="btn btn-sm" href="#/quiz">刷错题</a></div></div></div></div></section>' +

      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>求职清单</h2><span class="meta">点一下就算完成</span></div><div class="panel-body"><div class="checklist">' +
      checks.map((c) => '<div class="check-item ' + (state.checklists[c.id] ? "done" : "") + '"><button class="check-box" data-action="toggle-check" data-id="' + c.id + '">' + icon("check") + '</button><div class="ci-text">' + esc(c.text) + "<span>" + esc(c.hint) + "</span></div></div>").join("") +
      "</div></div></section>" +

      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>投递记录</h2><span class="meta">' + apps.length + " 家</span></div><div class=\"panel-body\">" +
      (apps.length ? '<div class="table-wrap"><table class="app-table"><thead><tr><th>公司 / 岗位</th><th>阶段</th><th>渠道</th><th>日期</th><th></th></tr></thead><tbody>' +
        apps.slice().reverse().map((a) => '<tr><td><div class="co">' + esc(a.company) + '</div><div class="role">' + esc(a.role) + '</div></td>' +
          '<td><select class="stage-select" data-stage-id="' + a.id + '">' + STAGES.map((s) => '<option ' + (a.stage === s ? "selected" : "") + ">" + s + "</option>").join("") + "</select></td>" +
          '<td>' + esc(a.channel || "—") + "</td><td class=\"mono\">" + esc(a.date || "") + "</td>" +
          '<td><button class="row-del" data-action="del-app" data-id="' + a.id + '" aria-label="删除">' + icon("trash") + "</button></td></tr>").join("") +
        "</tbody></table></div>" : '<div class="empty" style="padding:30px"><div class="empty-icon">' + icon("briefcase") + "</div><h3>还没有投递记录</h3><p>先投 10 家练手，再根据反馈改简历。不要等“准备好”。</p><button class=\"btn btn-sm btn-primary\" data-action=\"add-app\">" + icon("plus") + "记录第一家</button></div>") +
      "</div></section>" +

      '<section class="panel" style="margin-top:18px"><div class="panel-head"><h2>项目故事卡</h2><span class="meta">填满 4 个字段算完成</span></div><div class="panel-body"><div class="story-list">' +
      specs.map((p, i) => {
        const s = state.stories[p.id] || {};
        return '<div class="story-card"><div class="story-head"><span class="sn">0' + (i + 1) + "</span><b>" + esc(p.name) + "</b><span>" + esc(p.weeks) + '</span></div><div class="story-body">' +
          storyField(p.id, "background", "背景", s.background, "业务问题、约束、为什么难") +
          storyField(p.id, "task", "任务", s.task, "你负责什么、目标指标") +
          storyField(p.id, "action", "行动", s.action, "关键取舍、替代方案、踩坑") +
          storyField(p.id, "result", "结果", s.result, "数字、对比 baseline、业务影响") +
          storyField(p.id, "tradeoff", "取舍", s.tradeoff, "如果重做会怎么改、残余风险") +
          "</div></div>";
      }).join("") + "</div></div></section>" +
      "</div><aside>" +

      '<section class="panel"><div class="panel-head"><h2>面试速答卡</h2><span class="meta">' + mastered + "/" + INTERVIEW.length + " 已掌握</span></div><div class=\"panel-body\"><div class=\"progress\" style=\"margin-bottom:12px\"><span style=\"width:" + pct(mastered, INTERVIEW.length) * 100 + '%"></span></div>' +
      cats.map((cat) => {
        const list = INTERVIEW.map((q, i) => ({ ...q, i })).filter((q) => q.cat === cat);
        return '<div class="section-head" style="margin:12px 0 7px"><h2 style="font-size:11px;color:var(--muted)">' + esc(cat) + " <span>" + list.length + "</span></h2></div>" +
          '<div class="accordion">' + list.map((q) => {
            const open = interviewOpen.has(q.i);
            return '<div class="acc-item ' + (open ? "open" : "") + '"><div class="acc-head">' +
              '<button class="check-box ' + (state.interviewMastered[q.i] ? "done" : "") + '" data-action="master-interview" data-id="' + q.i + '" aria-label="标记掌握">' + icon("check") + "</button>" +
              '<button class="acc-toggle" data-action="toggle-interview" data-id="' + q.i + '"><span class="cat">Q' + (q.i + 1) + "</span><b>" + esc(q.q) + "</b>" + icon("chevron") + "</button></div>" +
              '<div class="acc-body ' + (open ? "show" : "") + '">' + esc(q.a) + "</div></div>";
          }).join("") + "</div>";
      }).join("") +
      "</div></section></aside></div></div>";
  }

  function storyField(projectId, key, label, value, placeholder) {
    return '<div class="story-field"><label>' + label + '</label><textarea data-story-field="' + key + '" data-project="' + projectId + '" placeholder="' + esc(placeholder) + '">' + esc(value || "") + "</textarea></div>";
  }

  function openAppModal() {
    openModal('<div class="modal-head"><div><h2>记录一次投递</h2><p>先记录，再跟进。面试后 24 小时内回来更新阶段和复盘。</p></div><button class="icon-btn" data-action="modal-close">' + icon("x") + "</button></div>" +
      '<div class="modal-body"><div class="form-grid">' +
      '<div class="field"><label>公司 *</label><input id="app-company" placeholder="例如：某 AI 创业公司" /></div>' +
      '<div class="field"><label>岗位 *</label><input id="app-role" placeholder="例如：LLM 应用开发工程师" /></div>' +
      '<div class="field"><label>渠道</label><input id="app-channel" placeholder="Boss / 内推 / 官网" /></div>' +
      '<div class="field"><label>投递日期</label><input id="app-date" type="date" value="' + todayStr() + '" /></div>' +
      '<div class="field"><label>阶段</label><select id="app-stage">' + STAGES.map((s) => '<option>' + s + "</option>").join("") + "</select></div>" +
      '<div class="field"><label>链接</label><input id="app-link" placeholder="JD / 招聘页链接" /></div>' +
      '<div class="field full"><label>备注</label><textarea id="app-notes" placeholder="JD 关键词、内推人、下一步..."></textarea></div>' +
      "</div><div class=\"modal-actions\"><button class=\"btn btn-ghost\" data-action=\"modal-close\">取消</button><button class=\"btn btn-primary\" data-action=\"save-app\">保存</button></div></div>", "modal-sm");
  }

  function saveApp() {
    const company = ($("#app-company") || {}).value || "";
    const role = ($("#app-role") || {}).value || "";
    if (!company.trim() || !role.trim()) { toast("公司和岗位至少填一个"); return; }
    state.applications.push({
      id: "app-" + Date.now(),
      company: company.trim(),
      role: role.trim(),
      channel: ($("#app-channel") || {}).value || "",
      date: ($("#app-date") || {}).value || todayStr(),
      stage: ($("#app-stage") || {}).value || "已投递",
      link: ($("#app-link") || {}).value || "",
      notes: ($("#app-notes") || {}).value || ""
    });
    saveState();
    closeModal();
    render();
    toast("已记录，记得 3 天后跟进");
  }

  /* ---------------- library ---------------- */
  let libraryTab = "knowledge";
  let glossaryQuery = "";
  let knowledgeQuery = "";

  function knowledgeWeekCard(w) {
    const title = w.title.replace(/^W\d+\s*·\s*/, "");
    const readCount = w.days.filter((d) => isKnowledgeRead(d.id)).length;
    return '<section class="knowledge-week"><div class="kw-head">' +
      '<span class="week-badge"><b>' + w.week + "</b><span>WEEK</span></span>" +
      '<div class="kw-title"><h3>W' + pad2(w.week) + " · " + esc(title) + "</h3><p>" + w.days.length + " 节 · 已读 " + readCount + "/" + w.days.length + "</p></div>" +
      '<button class="btn btn-sm btn-soft" data-action="open-knowledge" data-day="' + w.days[0].id + '">' + icon("book") + "阅读</button></div>" +
      '<div class="kw-days">' + w.days.map((d) => {
        const read = isKnowledgeRead(d.id);
        return '<button class="kw-day ' + (read ? "read" : "") + '" data-action="open-knowledge" data-day="' + d.id + '"><span class="kd-num">D' + d.day + "</span>" +
          '<span class="kd-main"><b>' + esc(d.title) + "</b><em>" + esc(d.summary) + "</em></span>" + icon(read ? "check" : "arrow-right") + "</button>";
      }).join("") + "</div></section>";
  }

  function knowledgeResultsHtml(q) {
    const query = String(q || "").trim().toLowerCase();
    if (!query) return "";
    const results = [];
    KNOWLEDGE.weeks.forEach((w) => w.days.forEach((d) => {
      const hay = [d.title, d.summary, (d.points || []).join(" "), d.markdown].join(" ").toLowerCase();
      if (hay.includes(query)) results.push(d);
    }));
    if (!results.length) return '<div class="empty" style="padding:30px"><div class="empty-icon">' + icon("book") + "</div><h3>没找到</h3><p>换个关键词试试：RAG、HNSW、LoRA、SSE、多租户……</p></div>";
    return '<div class="kr-count">找到 ' + results.length + " 节笔记</div>" + results.slice(0, 24).map((d) =>
      '<button class="knowledge-result" data-action="open-knowledge" data-day="' + d.id + '"><span class="kr-week">W' + pad2(d.week) + " · D" + d.day + "</span>" +
      "<b>" + esc(d.title) + "</b><em>" + esc(d.summary) + "</em>" + icon("arrow-right") + "</button>"
    ).join("");
  }

  function renderLibrary() {
    const tabs = [["knowledge", "知识库"], ["projects", "项目规格"], ["java", "Java 优势"], ["glossary", "术语表"]];
    const totalNotes = KNOWLEDGE.weeks.reduce((n, w) => n + w.days.length, 0);
    const readTotal = Object.keys(state.knowledgeRead).filter((id) => KNOWLEDGE.byDay[id]).length;
    return '<div class="view">' +
      '<div class="page-head"><div><div class="eyebrow"><span class="line"></span>LIBRARY · 知识库与规格</div>' +
      "<h1>把知识，变成自己的话。</h1><p>16 篇本地 Markdown 周笔记，112 节知识卡，和每天的任务一一对应。不再收藏外链，直接读、直接做。</p></div>" +
      '<div class="page-actions"><a class="btn btn-sm" href="print.html" target="_blank" rel="noopener">' + icon("note") + "打印 A4 复习册</a>" +
      '<a class="btn btn-sm" href="16周知识复习册.pdf" download>' + icon("download") + "下载 PDF</a>" +
      '<div class="tabs">' + tabs.map(([id, label]) => '<button class="tab ' + (libraryTab === id ? "active" : "") + '" data-action="lib-tab" data-tab="' + id + '">' + label + "</button>").join("") + "</div></div></div>" +

      '<div class="tab-panel ' + (libraryTab === "knowledge" ? "active" : "") + '">' +
      '<div class="knowledge-intro"><div><div class="eyebrow"><span class="line"></span>LOCAL MARKDOWN</div><h2>' + totalNotes + " 节知识卡，全部在本地</h2><p>每节包含：一句话、核心知识、速查/代码、常见坑、面试口述。先读当天小节，再去做任务。</p></div>" +
      '<div class="ki-stats"><div><b>16</b><span>周笔记</span></div><div><b>' + totalNotes + '</b><span>节知识卡</span></div><div><b>' + readTotal + '</b><span>已读</span></div><div><b>112</b><span>任务关联</span></div></div></div>' +
      '<div class="page-actions" style="margin:16px 0 4px"><div class="search-box" style="width:min(520px,100%)">' + icon("quiz") + '<input type="search" data-knowledge-search placeholder="搜索知识点：RAG、HNSW、SSE、多租户、LoRA..." value="' + esc(knowledgeQuery) + '" /></div></div>' +
      '<div id="knowledge-results" class="knowledge-results">' + knowledgeResultsHtml(knowledgeQuery) + "</div>" +
      '<div id="knowledge-weeks" class="knowledge-grid" ' + (knowledgeQuery.trim() ? 'style="display:none"' : "") + ">" + KNOWLEDGE.weeks.map(knowledgeWeekCard).join("") + "</div>" +
      "</div>" +

      '<div class="tab-panel ' + (libraryTab === "projects" ? "active" : "") + '">' +
      (META.projectSpecs || []).map((p, i) => '<div class="project-spec"><div class="ps-top"><div><div class="eyebrow"><span class="line"></span>PROJECT 0' + (i + 1) + " · " + esc(p.weeks) + "</div><h3>" + esc(p.name) + '</h3><p class="ps-sub">' + esc(p.tagline) + '</p><div class="stack">' + p.stack.map((s) => "<span>" + esc(s) + "</span>").join("") + "</div></div></div>" +
        '<div class="ps-grid"><div><h4>核心功能</h4><ul>' + p.features.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul></div><div><h4>验收指标</h4><ul>" + p.metrics.map((m) => "<li>" + esc(m) + "</li>").join("") + "</ul></div></div>" +
        '<div style="margin-top:16px;padding:13px 15px;border-radius:10px;background:var(--surface-2);border-left:3px solid var(--teal)"><div class="tiny" style="color:var(--teal);font-weight:700;letter-spacing:.08em">RESUME BULLET</div><p class="small" style="margin-top:4px;color:var(--ink-2)">' + esc(p.resume) + "</p></div></div>").join("") +
      "</div>" +

      '<div class="tab-panel ' + (libraryTab === "java" ? "active" : "") + '">' +
      '<div class="section-head"><h2>Java 能力迁移地图 <span>YOUR MOAT</span></h2></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Java 能力</th><th>迁移到 AI 工程</th><th>面试怎么讲</th></tr></thead><tbody>' +
      (META.javaMap || []).map((r) => "<tr><td><b>" + esc(r.java) + "</b></td><td>" + esc(r.ai) + "</td><td>" + esc(r.talk) + "</td></tr>").join("") +
      "</tbody></table></div>" +
      '<div class="section-head"><h2>一句话定位 <span>30 SEC</span></h2></div><div class="card card-pad"><p style="font-family:var(--serif);font-size:20px;line-height:1.7">“我有多年 Java 后端经验，懂高并发、数据库、微服务与工程化；同时能独立完成 LLM 应用从 RAG/Agent 设计、评测、部署到成本优化的全链路，是能把 AI Demo 做成生产系统的工程师。”</p></div>' +
      "</div>" +

      '<div class="tab-panel ' + (libraryTab === "glossary" ? "active" : "") + '">' +
      '<div class="page-actions" style="margin-bottom:12px"><div class="search-box" style="width:min(420px,100%)">' + icon("quiz") + '<input type="search" data-glossary-search placeholder="搜索术语，例如 RAG、HNSW、LoRA..." value="' + esc(glossaryQuery) + '" /></div></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th style="width:160px">术语</th><th>一句话解释</th></tr></thead><tbody id="glossary-body">' + glossaryRows(glossaryQuery) + "</tbody></table></div></div>" +
      "</div>";
  }

  function glossaryRows(q) {
    const query = String(q || "").trim().toLowerCase();
    return (META.glossary || []).filter(([term, def]) => !query || term.toLowerCase().includes(query) || def.toLowerCase().includes(query))
      .map(([term, def]) => '<tr><td><b>' + esc(term) + "</b></td><td>" + esc(def) + "</td></tr>").join("");
  }

  /* ---------------- settings / data ---------------- */
  function openSettings() {
    const s = state.settings;
    openModal('<div class="modal-head"><div><h2>设置与数据</h2><p>数据保存在当前浏览器 localStorage。换设备前先导出 JSON。</p></div><button class="icon-btn" data-action="modal-close">' + icon("x") + "</button></div>" +
      '<div class="modal-body"><div class="form-grid">' +
      '<div class="field"><label>你的名字（可选）</label><input id="set-name" value="' + esc(s.name) + '" placeholder="怎么称呼你" /></div>' +
      '<div class="field"><label>目标岗位</label><input id="set-role" value="' + esc(s.targetRole) + '" /></div>' +
      '<div class="field"><label>开始日期</label><input id="set-start" type="date" value="' + esc(s.startDate) + '" /><span class="hint">修改后所有日期顺延，已完成记录保留。</span></div>' +
      '<div class="field"><label>每天可用分钟</label><input id="set-minutes" type="number" min="30" max="600" step="15" value="' + Number(s.dailyMinutes || 150) + '" /></div>' +
      '<div class="field"><label>主题</label><select id="set-theme"><option value="light" ' + (s.theme === "light" ? "selected" : "") + '>浅色 · 纸张</option><option value="dark" ' + (s.theme === "dark" ? "selected" : "") + '>深色 · 夜间</option></select></div>' +
      '<div class="field"><label>计划</label><input value="16 周 · 112 天 · 3 个项目" disabled /></div>' +
      "</div>" +
      '<div class="divider"></div><div class="section-head" style="margin:0 0 9px"><h2 style="font-size:12px">数据备份</h2></div><div class="data-actions">' +
      '<button class="btn btn-sm" data-action="export-data">' + icon("download") + "导出 JSON</button>" +
      '<button class="btn btn-sm" data-action="import-data">' + icon("upload") + "导入 JSON</button>" +
      '<button class="btn btn-sm btn-danger" data-action="reset-data">' + icon("trash") + "清空进度</button>" +
      '<input type="file" id="import-file" accept="application/json,.json" hidden /></div>' +
      '<p class="small muted" style="margin-top:10px">清空会删除任务、笔记、测验、卡片、投递记录，无法撤销。建议先导出。</p>' +
      '<div class="modal-actions"><button class="btn btn-ghost" data-action="modal-close">取消</button><button class="btn btn-primary" data-action="save-settings">保存设置</button></div></div>', "modal-sm");
  }

  function saveSettings() {
    const start = ($("#set-start") || {}).value || "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || isNaN(parseDate(start).getTime())) { toast("开始日期格式不对"); return; }
    state.settings.name = ($("#set-name") || {}).value || "";
    state.settings.targetRole = ($("#set-role") || {}).value || META.targetRole;
    state.settings.startDate = start;
    state.settings.dailyMinutes = Number(($("#set-minutes") || {}).value) || 150;
    state.settings.theme = ($("#set-theme") || {}).value || "light";
    refreshDates();
    applyTheme();
    saveState();
    closeModal();
    render();
    toast("设置已保存");
  }

  function exportData() {
    const payload = { ...state, exportedAt: new Date().toISOString(), app: "ai-jump-coach", version: 1 };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ai-jump-backup-" + todayStr() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast("已导出备份");
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !data.settings || !data.days) throw new Error("文件结构不对");
        const base = defaultState();
        state = {
          ...base,
          ...data,
          settings: { ...base.settings, ...(data.settings || {}) },
          days: data.days || {},
          quiz: data.quiz || {},
          cards: data.cards || {},
          applications: Array.isArray(data.applications) ? data.applications : [],
          checklists: data.checklists || {},
          stories: data.stories || {},
          prep: data.prep || {},
          interviewMastered: data.interviewMastered || {},
          meta: { ...base.meta, ...(data.meta || {}) }
        };
        refreshDates();
        applyTheme();
        saveState();
        closeModal();
        render();
        toast("导入成功");
      } catch (e) {
        console.warn(e);
        toast("导入失败：不是有效的备份 JSON");
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!confirm("确定清空所有学习进度吗？此操作无法撤销。")) return;
    if (!confirm("再确认一次：任务、笔记、测验、卡片、投递记录都会删除。")) return;
    localStorage.removeItem(STORE_KEY);
    state = defaultState();
    refreshDates();
    applyTheme();
    closeModal();
    render();
    toast("已清空，重新开始");
  }

  /* ---------------- router / render ---------------- */
  function render() {
    const r = route();
    setActiveNav(r);
    let html = "";
    if (r === "/today") html = renderToday();
    else if (r.indexOf("/day/") === 0) html = renderDay(r.split("/")[2]);
    else if (r === "/roadmap") html = renderRoadmap();
    else if (r === "/dashboard") html = renderDashboard();
    else if (r === "/quiz") html = renderQuizHub();
    else if (r === "/review") html = renderReview();
    else if (r === "/jobs") html = renderJobs();
    else if (r === "/library") html = renderLibrary();
    else html = renderToday();
    $("#app").innerHTML = html;
    updateMeta();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function viewingDay() {
    const r = route();
    if (r.indexOf("/day/") === 0) return PLAN.byId[r.split("/")[2]] || currentDay();
    return currentDay();
  }

  /* ---------------- events ---------------- */
  function onClick(e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    if (action === "modal-backdrop") {
      if (e.target === el) closeModal();
      return;
    }
    if (action === "modal-close") {
      const wasKnowledge = !!$(".knowledge-modal");
      closeModal();
      if (wasKnowledge) render();
      return;
    }

    if (action === "toggle-task") {
      const day = PLAN.byId[el.dataset.day];
      const i = Number(el.dataset.task);
      if (!day || !day.tasks[i]) return;
      const ds = getDayState(day.id);
      const on = !ds.tasks[i];
      ds.tasks[i] = on;
      ds.minutes = Math.max(0, (ds.minutes || 0) + (on ? day.tasks[i].minutes : -day.tasks[i].minutes));
      ds.lastActiveAt = new Date().toISOString();
      saveState();
      render();
      return;
    }
    if (action === "complete-day") {
      const day = PLAN.byId[el.dataset.day];
      if (!day) return;
      const ds = getDayState(day.id);
      const p = dayProgress(day);
      if (p.done === 0) { toast("至少完成一个任务再打卡"); return; }
      if (hasKnowledge(day) && !isKnowledgeRead(day.id)) {
        toast("先读今日知识卡，并点「标记已读」");
        openKnowledge(day.id);
        return;
      }
      if (!p.all && !confirm("还有任务没完成，仍然标记今天完成吗？")) return;
      ds.completed = true;
      ds.completedAt = new Date().toISOString();
      ds.lastActiveAt = ds.completedAt;
      if (day.oral) {
        const id = "oral-" + day.id;
        addCard(id, { type: "oral", front: day.oral.q, back: day.oral.a, ref: { week: day.week, day: day.day } });
      }
      saveState();
      celebrate();
      toast("今日打卡完成，明天见");
      render();
      return;
    }
    if (action === "start-quiz") {
      startQuiz(el.dataset.mode, { day: el.dataset.day, week: el.dataset.week });
      return;
    }
    if (action === "open-knowledge") {
      openKnowledge(el.dataset.day);
      return;
    }
    if (action === "toggle-knowledge-read") {
      toggleKnowledgeRead(el.dataset.day);
      return;
    }
    if (action === "quiz-select") {
      if (!quizSession) return;
      const ans = quizSession.answers[quizSession.index];
      if (!ans || ans.submitted) return;
      quizSession.selected = Number(el.dataset.index);
      paintQuiz();
      return;
    }
    if (action === "quiz-submit") {
      if (!quizSession) return;
      const ans = quizSession.answers[quizSession.index];
      if (!ans || ans.kind !== "mcq" || quizSession.selected == null) return;
      ans.selected = quizSession.selected;
      ans.correct = ans.selected === ans.item.answer;
      ans.submitted = true;
      ans.score = ans.correct ? 1 : 0;
      paintQuiz();
      return;
    }
    if (action === "quiz-next") {
      if (!quizSession) return;
      if (quizSession.index >= quizSession.items.length - 1) { finishQuiz(); return; }
      quizSession.index += 1;
      quizSession.selected = null;
      quizSession.showRef = false;
      paintQuiz();
      return;
    }
    if (action === "quiz-rate") {
      if (!quizSession) return;
      const ans = quizSession.answers[quizSession.index];
      if (!ans || ans.kind !== "oral" || ans.submitted) return;
      ans.rating = Number(el.dataset.rating);
      ans.score = ans.rating / 2;
      ans.submitted = true;
      paintQuiz();
      return;
    }
    if (action === "quiz-reveal-ref") {
      if (!quizSession) return;
      quizSession.showRef = true;
      paintQuiz();
      return;
    }
    if (action === "quiz-close") {
      const wasQuick = quizSession && quizSession.mode === "quick";
      const quickDay = quizSession && quizSession.dayId;
      if (quizSession && !quizSession.finished && quizSession.answers.some((a) => a.submitted)) {
        if (!confirm("测验还没完成，确定退出吗？")) return;
      }
      quizSession = null;
      closeModal();
      if (wasQuick && quickDay) openKnowledge(quickDay);
      else render();
      return;
    }
    if (action === "quiz-retry") {
      if (!quizSession) return;
      const items = quizSession.items.slice();
      const title = quizSession.title;
      const dayId = quizSession.dayId;
      const mode = quizSession.mode;
      startQuizWithItems(items, title, dayId, mode);
      return;
    }
    if (action === "quiz-retry-wrong") { retryWrong(); return; }

    if (action === "reveal-oral") {
      const day = PLAN.byId[el.dataset.day];
      if (!day) return;
      const ds = getDayState(day.id);
      ds.oral.revealed = !ds.oral.revealed;
      saveState();
      render();
      return;
    }
    if (action === "rate-oral") {
      const day = PLAN.byId[el.dataset.day];
      if (!day) return;
      const ds = getDayState(day.id);
      ds.oral.rating = Number(el.dataset.rating);
      ds.oral.revealed = true;
      ds.lastActiveAt = new Date().toISOString();
      if (day.oral) {
        const id = "oral-" + day.id;
        addCard(id, { type: "oral", front: day.oral.q, back: day.oral.a, ref: { week: day.week, day: day.day } });
        const card = state.cards[id];
        card.lastRating = ds.oral.rating;
        card.due = ds.oral.rating >= 2 ? addDays(todayStr(), 2) : todayStr();
      }
      saveState();
      toast(ds.oral.rating === 2 ? "已记录：讲清楚了，2 天后再复习" : "已记录，今天会再出现");
      render();
      return;
    }
    if (action === "timer-toggle") {
      if (timer.running) pauseTimer();
      else {
        const d = viewingDay();
        startTimer(d && d.id);
      }
      paintTimer();
      return;
    }
    if (action === "timer-reset") {
      pauseTimer();
      timer.remaining = 25 * 60;
      paintTimer();
      return;
    }
    if (action === "toggle-week") {
      const n = Number(el.dataset.week);
      const card = el.closest(".week-card");
      if (openWeeks.has(n)) openWeeks.delete(n); else openWeeks.add(n);
      if (card) card.classList.toggle("open", openWeeks.has(n));
      return;
    }
    if (action === "toggle-prep") {
      const id = el.dataset.id;
      state.prep[id] = !state.prep[id];
      saveState();
      render();
      return;
    }
    if (action === "start-now") {
      if (!confirm("把开始日期改为今天，并从第 1 天开始？")) return;
      state.settings.startDate = todayStr();
      refreshDates();
      saveState();
      render();
      toast("开营，今天就是第 1 天");
      return;
    }
    if (action === "open-settings") { openSettings(); return; }
    if (action === "save-settings") { saveSettings(); return; }
    if (action === "export-data") { exportData(); return; }
    if (action === "import-data") { const f = $("#import-file"); if (f) f.click(); return; }
    if (action === "reset-data") { resetData(); return; }
    if (action === "add-app") { openAppModal(); return; }
    if (action === "save-app") { saveApp(); return; }
    if (action === "del-app") {
      if (!confirm("删除这条投递记录？")) return;
      state.applications = state.applications.filter((a) => a.id !== el.dataset.id);
      saveState();
      render();
      return;
    }
    if (action === "toggle-check") {
      const id = el.dataset.id;
      state.checklists[id] = !state.checklists[id];
      saveState();
      render();
      return;
    }
    if (action === "master-interview") {
      const id = el.dataset.id;
      state.interviewMastered[id] = !state.interviewMastered[id];
      saveState();
      render();
      return;
    }
    if (action === "toggle-interview") {
      const id = el.dataset.id;
      const item = el.closest(".acc-item");
      if (interviewOpen.has(id)) interviewOpen.delete(id); else interviewOpen.add(id);
      if (item) {
        item.classList.toggle("open", interviewOpen.has(id));
        const body = $(".acc-body", item);
        if (body) body.classList.toggle("show", interviewOpen.has(id));
      }
      return;
    }
    if (action === "lib-tab") { libraryTab = el.dataset.tab; render(); return; }
    if (action === "reveal-card") { reviewRevealed = true; render(); return; }
    if (action === "rate-card") {
      const id = el.dataset.id;
      const rating = Number(el.dataset.rating);
      const card = state.cards[id];
      if (!card) return;
      scheduleCard(card, rating);
      reviewRevealed = false;
      saveState();
      toast("下次复习：" + card.due + "（" + card.interval + " 天后）");
      render();
      return;
    }
    if (action === "generate-oral-card") {
      const day = PLAN.byId[el.dataset.day];
      if (!day || !day.oral) return;
      const id = "oral-" + day.id;
      addCard(id, { type: "oral", front: day.oral.q, back: day.oral.a, ref: { week: day.week, day: day.day } });
      saveState();
      toast("已加入复习队列");
      render();
      return;
    }
  }

  function onChange(e) {
    if (e.target.id === "import-file") {
      const f = e.target.files && e.target.files[0];
      importData(f);
      e.target.value = "";
      return;
    }
    if (e.target.matches("[data-stage-id]")) {
      const id = e.target.dataset.stageId;
      const app = state.applications.find((a) => a.id === id);
      if (app) {
        app.stage = e.target.value;
        saveState();
        toast("阶段已更新");
      }
    }
  }

  function onInput(e) {
    const t = e.target;
    if (t.matches("[data-note]")) {
      const dayId = t.dataset.day;
      const key = t.dataset.note;
      const ds = getDayState(dayId);
      ds.notes[key] = t.value;
      ds.lastActiveAt = new Date().toISOString();
      saveState(true);
      const count = $('[data-count-for="' + dayId + "-" + key + '"]');
      if (count) count.textContent = t.value.length;
      return;
    }
    if (t.matches("[data-oral-text]")) {
      if (!quizSession) return;
      const ans = quizSession.answers[quizSession.index];
      if (ans) ans.text = t.value;
      return;
    }
    if (t.matches("[data-story-field]")) {
      const pid = t.dataset.project;
      const key = t.dataset.storyField;
      if (!state.stories[pid]) state.stories[pid] = {};
      state.stories[pid][key] = t.value;
      saveState(true);
      return;
    }
    if (t.matches("[data-note-search]")) { renderNoteResults(t.value); return; }
    if (t.matches("[data-knowledge-search]")) {
      knowledgeQuery = t.value;
      const box = $("#knowledge-results");
      const weeks = $("#knowledge-weeks");
      if (box) box.innerHTML = knowledgeResultsHtml(knowledgeQuery);
      if (weeks) weeks.style.display = knowledgeQuery.trim() ? "none" : "";
      return;
    }
    if (t.matches("[data-glossary-search]")) {
      glossaryQuery = t.value;
      const body = $("#glossary-body");
      if (body) body.innerHTML = glossaryRows(glossaryQuery);
      return;
    }
  }

  function onKeydown(e) {
    if (!quizSession || quizSession.finished) return;
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "TEXTAREA" || tag === "INPUT") return;
    const item = quizSession.items[quizSession.index];
    if (!item) return;
    if (item.kind === "mcq") {
      if (/^[1-4]$/.test(e.key)) {
        e.preventDefault();
        quizSession.selected = Number(e.key) - 1;
        paintQuiz();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const ans = quizSession.answers[quizSession.index];
        if (ans && ans.submitted) {
          if (quizSession.index >= quizSession.items.length - 1) finishQuiz();
          else { quizSession.index++; quizSession.selected = null; paintQuiz(); }
        } else if (quizSession.selected != null) {
          const a = quizSession.answers[quizSession.index];
          a.selected = quizSession.selected;
          a.correct = a.selected === a.item.answer;
          a.submitted = true;
          a.score = a.correct ? 1 : 0;
          paintQuiz();
        }
      }
    }
  }

  /* ---------------- init ---------------- */
  function init() {
    applyTheme();
    if (!PLAN.days.length) {
      $("#app").innerHTML = '<div class="empty"><h3>数据加载失败</h3><p>请确认 data/ 目录下的课程与题库文件存在。</p></div>';
      return;
    }
    ["theme-btn", "theme-btn-mobile"].forEach((id) => {
      const b = document.getElementById(id);
      if (b) b.addEventListener("click", toggleTheme);
    });
    ["settings-btn", "settings-btn-mobile"].forEach((id) => {
      const b = document.getElementById(id);
      if (b) b.addEventListener("click", openSettings);
    });
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("input", onInput);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("hashchange", render);
    window.addEventListener("beforeunload", () => saveState(true));
    render();
    updateMeta();
    saveState(true);
  }

  init();
})();
