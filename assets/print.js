(function () {
  "use strict";
  const K = window.KNOWLEDGE || { weeks: [] };
  const book = document.getElementById("book");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const total = K.weeks.reduce((n, w) => n + w.days.length, 0);
  const today = new Date();
  const dateText = today.getFullYear() + "." + String(today.getMonth() + 1).padStart(2, "0") + "." + String(today.getDate()).padStart(2, "0");

  const cover = '<section class="cover">' +
    '<div class="cover-mark">AI 跃迁</div>' +
    '<div class="cover-kicker">JAVA BACKEND → AI APPLICATION ENGINEER</div>' +
    '<h1>16 周知识<br>复习册</h1>' +
    '<p class="cover-sub">从 Python、RAG、Agent 到 Java AI 工程。<br>112 节知识卡，按周整理，随时翻回。</p>' +
    '<div class="cover-stats"><div><b>16</b><span>周</span></div><div><b>' + total + '</b><span>节</span></div><div><b>3</b><span>个项目</span></div></div>' +
    '<div class="cover-foot"><span>打印建议：A4 纵向 · 默认边距 · 勾选背景图形</span><span>' + dateText + "</span></div>" +
    "</section>";

  const toc = '<section class="toc page-break">' +
    '<div class="section-label">CONTENTS</div><h2>目录</h2>' +
    '<div class="toc-grid">' + K.weeks.map((w) => {
      const title = w.title.replace(/^W\d+\s*·\s*/, "");
      return '<div class="toc-week"><b>W' + String(w.week).padStart(2, "0") + " · " + esc(title) + "</b>" +
        '<span>' + w.days.map((d) => "D" + d.day + " " + esc(d.title)).join(" · ") + "</span></div>";
    }).join("") + "</div>" +
    '<div class="toc-note">用法：每个 Day 先看“一句话”和“核心知识”，遮住答案口述“面试口述”，再对照“常见坑”。会的打勾，不会的回到学习助手做随堂小测。</div>' +
    "</section>";

  const weeks = K.weeks.map((w) => {
    const title = w.title.replace(/^W\d+\s*·\s*/, "");
    return '<section class="week page-break">' +
      '<header class="week-head"><div class="week-no">W' + String(w.week).padStart(2, "0") + "</div>" +
      "<div><h2>" + esc(title) + "</h2><p>7 节知识卡 · 先回忆，再对照</p></div></header>" +
      '<div class="week-days">' + w.days.map((d) => {
        const points = (d.points || []).map((p) => "<li>" + esc(p) + "</li>").join("");
        const pitfalls = (d.pitfalls || []).map((p) => "<li>" + esc(p) + "</li>").join("");
        return '<article class="day">' +
          '<div class="day-head"><span class="check">□</span><span class="day-no">DAY ' + d.day + "</span><h3>" + esc(d.title) + "</h3></div>" +
          '<p class="day-summary">' + esc(d.summary || "") + "</p>" +
          (points ? '<div class="day-block"><b>核心知识</b><ul>' + points + "</ul></div>" : "") +
          (pitfalls ? '<div class="day-block pitfall"><b>常见坑</b><ul>' + pitfalls + "</ul></div>" : "") +
          (d.interview ? '<div class="day-block interview"><b>面试口述</b><p>' + esc(d.interview) + "</p></div>" : "") +
          '<div class="day-link">对应任务：学习舱 ' + esc(d.id) + "（" + (d.tasks ? d.tasks.length : 0) + " 个）</div>" +
          "</article>";
      }).join("") + "</div></section>";
  }).join("");

  book.innerHTML = cover + toc + weeks;
})();
