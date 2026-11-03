"use strict";
(() => {
  const C = window.CHALLENGES, LEVELS = window.LEVELS;
  const LANG = { cs: "C#", cpp: "C++" };
  const KEY = "codestreak.v1";
  const $ = (s) => document.querySelector(s);
  const app = $("#app");

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const norm = (s) => s.trim().replace(/\s+/g, " ");
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
  const byId = (id) => C.find((c) => c.id === id);
  const ofLang = (l) => C.filter((c) => c.lang === l);

  /* ---------- state ---------- */
  const fresh = () => ({ done: {}, xp: 0, streak: 0, best: 0, last: "", lang: "cs", daily: {}, mistakes: [], proj: {} });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  const liveStreak = () => (S.last === dayKey() || S.last === yesterday() ? S.streak : 0);

  function dailyFor(lang) {
    const today = dayKey();
    const d = S.daily[lang];
    if (d && d.date === today && byId(d.id)) return byId(d.id);
    const list = ofLang(lang);
    let pick = list.find((c) => !S.done[c.id]);
    if (!pick) { // everything done: rotate through for revision
      const n = Math.floor(Date.now() / 864e5);
      pick = list[n % list.length];
    }
    S.daily[lang] = { date: today, id: pick.id };
    save();
    return pick;
  }
  const doneToday = (id) => S.done[id] && S.done[id].on === dayKey();

  function complete(ch, tries, hinted) {
    const first = !S.done[ch.id];
    const xp = first ? (tries === 1 && !hinted ? 10 : 5) : 2;
    if (first) S.done[ch.id] = { on: dayKey(), tries };
    S.xp += xp;
    bumpStreak();
    save(); renderStats();
    return xp;
  }

  // Any learning activity for the day (a challenge or a project step) keeps the streak going
  function bumpStreak() {
    const t = dayKey();
    if (S.last === t) return;
    S.streak = S.last === yesterday() ? S.streak + 1 : 1;
    S.last = t;
    S.best = Math.max(S.best, S.streak);
  }

  /* ---------- syntax highlighting ---------- */
  const KW = "abstract|as|async|await|bool|break|case|catch|char|class|const|continue|default|do|double|else|enum|false|finally|float|for|foreach|get|if|in|int|interface|is|long|namespace|new|null|nullptr|override|private|public|readonly|return|set|static|string|struct|switch|template|this|throw|true|try|typename|using|var|virtual|void|while|auto|unsigned|constexpr";
  const HL = new RegExp(`(\\/\\/.*)|(\\$?"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')|(^\\s*#\\w+)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b(?:${KW})\\b)|(___)|(\\bstd::\\w+|\\b[A-Z]\\w*\\b)|(=>|<<|>>|\\?\\.|\\?\\?)`, "gm");
  function hl(code) {
    let out = "", i = 0, m;
    HL.lastIndex = 0;
    while ((m = HL.exec(code))) {
      out += esc(code.slice(i, m.index));
      const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "p" : m[4] ? "n" : m[5] ? "k" : m[6] ? "b" : m[7] ? "t" : "p";
      out += `<span class="${cls}">${esc(m[0])}</span>`;
      i = m.index + m[0].length;
      if (m[0] === "") HL.lastIndex++;
    }
    return out + esc(code.slice(i));
  }
  const codeBlock = (c) => `<pre class="code" tabindex="0"><code>${hl(c)}</code></pre>`.replace("<code>", '<code style="background:none;padding:0;color:inherit;font-size:inherit">');

  /* ---------- views ---------- */
  function renderStats() {
    $("#stats").innerHTML = `<span class="pill fire" title="Day streak">🔥 ${liveStreak()}</span><span class="pill xp" title="Experience points">⚡ ${S.xp} XP</span>`;
  }
  function setTab(t) {
    document.querySelectorAll("#tabs a").forEach((a) => (a.dataset.tab === t ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  }
  const langSwitch = () => `<div class="seg" role="group" aria-label="Language">
    ${Object.keys(LANG).map((l) => `<button data-act="lang" data-lang="${l}" aria-pressed="${S.lang === l}">${LANG[l]}</button>`).join("")}</div>`;
  const chips = (c) => `<div class="chips"><span class="chip ${c.lang}">${LANG[c.lang]}</span><span class="chip">${cap(c.level)}</span>${S.done[c.id] ? '<span class="chip">✓ Done</span>' : ""}</div>`;

  function viewToday() {
    setTab("today");
    const d = dailyFor(S.lang), list = ofLang(S.lang);
    const done = doneToday(d.id);
    const total = list.filter((c) => S.done[c.id]).length;
    const h = new Date().getHours();
    const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    app.innerHTML = `
      <h1>${greet}.</h1>
      <p class="sub">${liveStreak() ? `You're on a ${liveStreak()}-day streak. Keep it going.` : "One challenge a day builds the habit. Start your streak today."}</p>
      ${langSwitch()}
      <section class="card daily">
        <div class="eyebrow">Today's challenge</div>
        <h3 style="font-size:21px;margin-top:4px">${esc(d.title)}</h3>
        ${chips(d)}
        <p class="muted">${fmt(d.learn[0]).slice(0, 170)}${d.learn[0].length > 170 ? "…" : ""}</p>
        <a class="btn block" href="#/c/${d.id}">${done ? "Review it again" : "Start challenge"}</a>
        ${done ? '<p class="muted" style="margin-bottom:0">Done for today. Come back tomorrow, or keep going on the Path.</p>' : ""}
      </section>
      <h2>${LANG[S.lang]} progress</h2>
      <div class="card">
        ${LEVELS.map((lv) => {
          const L = list.filter((c) => c.level === lv), n = L.filter((c) => S.done[c.id]).length;
          return `<div class="lvl"><span>${cap(lv)}</span><span>${n} / ${L.length}</span></div><div class="bar" role="progressbar" aria-valuenow="${n}" aria-valuemax="${L.length}"><i style="width:${(n / L.length) * 100}%"></i></div>`;
        }).join("")}
        <p class="muted" style="margin-bottom:0">${total} of ${list.length} complete · best streak ${S.best} day${S.best === 1 ? "" : "s"}</p>
      </div>`;
  }

  function viewPath() {
    setTab("path");
    const list = ofLang(S.lang), next = list.find((c) => !S.done[c.id]);
    app.innerHTML = `<h1>Learning path</h1><p class="sub">Work top to bottom, beginner to advanced.</p>${langSwitch()}` +
      LEVELS.map((lv) => `<h2>${cap(lv)}</h2>` + list.filter((c) => c.level === lv).map((c) => {
        const i = list.indexOf(c) + 1;
        return `<a class="row ${S.done[c.id] ? "done" : ""} ${next && next.id === c.id ? "today" : ""}" href="#/c/${c.id}">
          <span class="n">${S.done[c.id] ? "✓" : i}</span><span class="t">${esc(c.title)}<small>${c.type === "choice" ? "Multiple choice" : "Type the answer"}${next && next.id === c.id ? " · up next" : ""}</small></span><span aria-hidden="true">›</span></a>`;
      }).join("")).join("");
  }

  function viewTips() {
    setTab("tips");
    const unlocked = C.filter((c) => S.done[c.id]);
    app.innerHTML = `<h1>Tips and tricks</h1><p class="sub">Unlocked as you finish challenges, plus your recent mistakes.</p>
      <h2>Recent mistakes</h2>` +
      (S.mistakes.length ? S.mistakes.slice(0, 12).map((m) => {
        const c = byId(m.id);
        return c ? `<div class="card mist"><div class="chips"><span class="chip ${c.lang}">${LANG[c.lang]}</span><span class="chip">${esc(c.title)}</span></div>
          <p class="muted" style="margin:4px 0">You answered: <code>${esc(m.a)}</code></p><p style="margin:4px 0">${fmt(m.tip)}</p></div>` : "";
      }).join("") : `<div class="card empty">No mistakes yet. They're where the learning happens, so don't fear them.</div>`) +
      `<h2>Tricks unlocked (${unlocked.length})</h2>` +
      (unlocked.length ? unlocked.map((c) => `<div class="card trick"><b>✦</b><div><div class="chips"><span class="chip ${c.lang}">${LANG[c.lang]}</span><span class="chip">${esc(c.title)}</span></div>${fmt(c.trick)}</div></div>`).join("")
        : `<div class="card empty">Finish a challenge to unlock your first trick.</div>`) +
      `<p style="text-align:center"><button class="link" data-act="reset">Reset all progress</button></p>`;
  }

  /* ---------- build (guided project) view ---------- */
  let runToken = 0;

  // Highlighted program with lines that changed since the previous step marked as new
  function projCode(code, prev) {
    const seen = {};
    prev.split("\n").forEach((l) => { const k = l.trim(); seen[k] = (seen[k] || 0) + 1; });
    const raw = code.split("\n"), html = hl(code).split("\n");
    return `<pre class="code proj" tabindex="0">${html.map((h, i) => {
      const k = raw[i].trim(), isNew = k && !(seen[k] > 0);
      if (seen[k] > 0) seen[k]--;
      return `<span class="ln${isNew ? " new" : ""}">${h || " "}</span>`;
    }).join("")}</pre>`;
  }

  // Print the simulated console output, line by line unless animation is off
  function runConsole(p, n, animate) {
    const out = $("#termOut");
    if (!out) return;
    const token = ++runToken, instant = !animate || matchMedia("(prefers-reduced-motion: reduce)").matches;
    out.innerHTML = "";
    window.projectOutput(p, n).forEach((line, i) => {
      const add = () => {
        if (token !== runToken || !$("#termOut")) return;
        const d = document.createElement("div");
        d.textContent = line;
        out.appendChild(d);
      };
      instant ? add() : setTimeout(add, 350 * (i + 1));
    });
  }

  // Quick-insert keys for phones, where symbols are slow to reach
  const KEYS = [["{", "{"], ["}", "}"], ["(", "("], [")", ")"], [";", ";"], ['"', '"'], ["<", "<"], [">", ">"], ["=", "="], ["+", "+"], ["-", "-"], ["*", "*"], ["/", "/"], ["[", "["], ["]", "]"], [".", "."], [",", ","], [":", ":"], ["?", "?"], ["&", "&"], ["|", "|"], ["!", "!"], ["$", "$"], ["_", "_"], ["⇥", "    "]];
  const boxLabel = (p, kind) => ({ head: "Top of the file", body: p.wrap ? "Inside main()" : "Main program", tail: "Bottom of the file" }[kind]);
  let solStep = 0;  // step number whose solution was revealed (earns less XP)
  let flash = "";   // one-off message shown after a step is added

  // Compare what was typed in each box with what the step expects, then add the step or explain the mistakes
  function checkBuild(ed) {
    const p = window.PROJECTS[S.lang], n = S.proj[S.lang] || 0, step = p && p.steps[n];
    if (!step || !step.needs.every((id) => S.done[id])) return;
    const boxes = window.projectBoxes(p, n + 1), tas = [...ed.querySelectorAll("textarea.ci")];
    const fails = [];
    boxes.forEach((b, i) => {
      const r = window.CodeCheck.diagnose(tas[i].value, b.expected, S.lang);
      if (!r.ok) fails.push([b, r.tips]);
    });
    if (fails.length) {
      $("#bfb").innerHTML = `<div class="fb bad" role="alert"><h4>Not quite yet</h4>${fails.map(([b, tips]) =>
        `<div class="tip"><b>${esc(boxLabel(p, b.kind))}:</b><ul>${tips.map((t) => `<li>${fmt(t)}</li>`).join("")}</ul></div>`).join("")}</div>`;
      return;
    }
    const xp = solStep === n + 1 ? 5 : 15;
    S.proj[S.lang] = n + 1; S.xp += xp; bumpStreak(); save(); renderStats();
    solStep = 0; flash = `Step ${n + 1} added. +${xp} XP`;
    viewBuild(); runConsole(p, n + 1, true);
    const t = $(".proj"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function viewBuild() {
    setTab("build");
    const p = window.PROJECTS[S.lang];
    if (!p) {
      app.innerHTML = `<h1>Build</h1><p class="sub">Make something real as you learn.</p>${langSwitch()}
        <div class="card empty">There is no project for this language yet.</div>`;
      return;
    }
    const total = p.steps.length, n = Math.min(S.proj[S.lang] || 0, total), next = p.steps[n];
    const todo = next ? next.needs.filter((id) => !S.done[id]).map(byId) : [];  // lessons still to do for the next step
    const ready = next && !todo.length;
    // Walkthrough of a step: what it does, how each part works, why the output looks that way
    const doc = (s) => `<p>${fmt(s.explain)}</p><h4 class="how-h">How it works</h4>
      <ol class="how">${s.how.map(([c, t]) => `<li><code>${esc(c)}</code><span>${fmt(t)}</span></li>`).join("")}</ol>
      <div class="why"><b>Why that output?</b> ${fmt(s.why)}</div>`;
    const added = p.steps.slice(0, Math.max(0, n - 1)).map((s, i) => `<details class="card step"><summary><span class="chip">Step ${i + 1}</span> ${esc(s.title)}</summary>${doc(s)}</details>`).join("");
    const justDid = n ? `<section class="card justdid"><div class="eyebrow">What you just built · step ${n}</div><h3>${esc(p.steps[n - 1].title)}</h3>${doc(p.steps[n - 1])}</section>` : "";
    let nextCard = "";
    if (!next) {
      nextCard = `<div class="card daily"><div class="eyebrow">Complete</div><h3>${esc(p.title)} is finished 🎉</h3><p class="muted">You built the whole game. Tweak the numbers in the code and predict what changes.</p></div>`;
    } else if (ready) {
      const boxes = window.projectBoxes(p, n + 1);
      nextCard = `<section class="card daily editor"><div class="eyebrow">Step ${n + 1} of ${total} · your turn</div><h3>${esc(next.title)}</h3><p>${fmt(next.explain)}</p>
        <p class="muted" style="margin-top:0">Type the code yourself. Spacing, line breaks and comments don't matter, but names and symbols do.</p>
        ${boxes.map((b, i) => {
          const label = boxLabel(p, b.kind);
          return `<div class="box"><div class="chips"><span class="chip">${label}</span>${b.start ? '<span class="chip">edit existing code</span>' : ""}</div>
            <p class="task">${fmt(next.tasks[i])}</p>
            <textarea class="ci" rows="${Math.max(3, Math.min(10, b.expected.split("\n").length + 1))}" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" aria-label="Your code: ${label}">${esc(b.start)}</textarea>
            <div class="keys" role="group" aria-label="Symbol keys">${KEYS.map(([k, ch]) => `<button type="button" class="key" data-act="ins" data-ch="${esc(ch)}" aria-label="Insert ${k === "⇥" ? "tab" : esc(k)}">${esc(k)}</button>`).join("")}</div></div>`;
        }).join("")}
        <div class="rowbtns"><button class="btn" data-act="check">Check my code</button><button class="btn alt" data-act="bhint">Hint</button><button class="btn alt" data-act="bsol">Show solution</button></div>
        <div id="bfb" aria-live="polite"></div></section>`;
    } else {
      nextCard = `<div class="card"><div class="eyebrow">Step ${n + 1} of ${total} · locked</div><h3>${esc(next.title)}</h3>
        <p class="muted">You haven't learned everything this step uses yet. Finish ${todo.length === 1 ? "this lesson" : "these lessons"} to unlock it:</p>
        ${todo.map((c) => `<a class="row" href="#/c/${c.id}"><span class="n">${LANG[c.lang] === "C#" ? "C#" : "C++"}</span><span class="t">${esc(c.title)}<small>${cap(c.level)}</small></span><span aria-hidden="true">›</span></a>`).join("")}</div>`;
    }
    const code = n ? window.projectCode(p, n) : "";
    app.innerHTML = `<h1>${esc(p.title)}</h1><p class="sub">${esc(p.intro)}</p>${langSwitch()}
      <div class="lvl"><span>Project progress</span><span>${n} / ${total} steps</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${n}" aria-valuemax="${total}"><i style="width:${(n / total) * 100}%"></i></div>
      ${flash ? `<div class="fb good" role="status"><h4>${esc(flash)}</h4></div>` : ""}
      ${nextCard}
      <h2>${esc(p.file)}</h2>
      ${n ? `<p class="muted" style="margin:0">Lines marked in yellow were added in the latest step.</p>${projCode(code, n > 1 ? window.projectCode(p, n - 1) : "")}
        <div class="term" aria-label="Simulated console"><div class="muted">$ ${esc(p.run)}</div><div id="termOut" aria-live="polite"></div></div>
        <button class="btn alt" data-act="run">▶ Run again</button>`
        : `<div class="card empty">Your file is empty. Write step 1 to start.</div>`}
      ${justDid}
      ${added ? `<h2>Earlier steps</h2>${added}` : ""}`;
    flash = "";
    if (n) runConsole(p, n, false);
  }

  /* ---------- challenge view ---------- */
  let cur = null; // {ch, tries, hinted, solved, order, bad:Set}
  function viewChallenge(id) {
    const ch = byId(id);
    if (!ch) return (location.hash = "#/today");
    setTab(S.daily[ch.lang] && S.daily[ch.lang].id === ch.id ? "today" : "path");
    const order = ch.type === "choice" ? shuffle(ch.opts.map((_, i) => i)) : null;
    cur = { ch, tries: 0, hinted: false, solved: false, order, bad: new Set() };
    app.innerHTML = `
      <a class="back" href="#/path">‹ Path</a>
      <h1>${esc(ch.title)}</h1>${chips(ch)}
      <details class="card learn" open><summary>Learn</summary>
        ${ch.learn.map((p) => `<p>${fmt(p)}</p>`).join("")}${ch.lcode ? codeBlock(ch.lcode) : ""}
      </details>
      <section class="card" aria-labelledby="q">
        <h3 id="q">${fmt(ch.q)}</h3>
        ${ch.code ? codeBlock(ch.code) : ""}
        <div id="answer"></div>
        <div id="hint"></div>
        <div id="fb" aria-live="polite"></div>
      </section>`;
    drawAnswer();
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function drawAnswer() {
    const { ch, order, bad, solved } = cur, box = $("#answer");
    if (ch.type === "choice") {
      box.innerHTML = `<div class="opts">${order.map((oi) => {
        const cls = solved && oi === ch.ans ? "good" : bad.has(oi) ? "bad" : "";
        return `<button class="opt ${cls}" data-act="pick" data-i="${oi}" ${bad.has(oi) || solved ? "disabled" : ""}>${fmt(ch.opts[oi][0])}</button>`;
      }).join("")}</div>`;
    } else {
      box.innerHTML = `<form class="ans" data-act="submit" autocomplete="off">
        <input name="a" aria-label="Your answer" placeholder="Type your answer" autocapitalize="off" autocorrect="off" spellcheck="false" ${solved ? "disabled" : ""}>
        <button class="btn" ${solved ? "disabled" : ""}>Check</button></form>`;
      if (!solved) $("#answer input").focus({ preventScroll: true });
    }
    if (!solved && ch.hint && !cur.hinted) $("#hint").innerHTML = `<button class="link" data-act="hint">Need a hint? (worth 5 XP instead of 10)</button>`;
  }

  function wrongAnswer(label, tip) {
    cur.tries++;
    S.mistakes = [{ id: cur.ch.id, a: label, tip, t: Date.now() }, ...S.mistakes].slice(0, 30);
    save();
    $("#fb").innerHTML = `<div class="fb bad" role="alert"><h4>Not quite</h4><div class="tip"><b>Tip:</b> ${fmt(tip)}</div></div>`;
  }
  function rightAnswer() {
    const ch = cur.ch;
    cur.tries++; cur.solved = true;
    const xp = complete(ch, cur.tries, cur.hinted);
    drawAnswer(); $("#hint").innerHTML = "";
    const list = ofLang(ch.lang), idx = list.indexOf(ch);
    const next = list.slice(idx + 1).concat(list.slice(0, idx)).find((c) => !S.done[c.id]);
    $("#fb").innerHTML = `<div class="fb good"><h4>Correct! +${xp} XP</h4><p style="margin:4px 0">${fmt(ch.explain)}</p>
      <div class="tip"><b>Trick:</b> ${fmt(ch.trick)}</div></div>
      ${next ? `<a class="btn block" href="#/c/${next.id}">Next: ${esc(next.title)} ›</a>` : `<a class="btn block" href="#/path">All done. Back to the path</a>`}`;
    $("#fb").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function checkTyped(raw) {
    const ch = cur.ch, v = norm(raw);
    if (!v) return;
    if (ch.answers.some((a) => a === v)) return rightAnswer();
    const hit = ch.wrong.find(([re]) => new RegExp(re, "i").test(v));
    wrongAnswer(v, hit ? hit[1] : ch.miss);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.tagName === "FORM") return;
    const act = el.dataset.act;
    if (act === "lang") { S.lang = el.dataset.lang; save(); route(); }
    else if (act === "pick" && cur && !cur.solved) {
      const i = +el.dataset.i;
      if (i === cur.ch.ans) rightAnswer();
      else { cur.bad.add(i); wrongAnswer(cur.ch.opts[i][0].replace(/`/g, ""), cur.ch.opts[i][1]); drawAnswer(); }
    } else if (act === "ins") {
      const ta = el.closest(".box").querySelector("textarea"), ch = el.dataset.ch;
      const a = ta.selectionStart, b = ta.selectionEnd;
      ta.value = ta.value.slice(0, a) + ch + ta.value.slice(b);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = a + ch.length;
    } else if (act === "check") {
      checkBuild(el.closest(".editor"));
    } else if (act === "bhint") {
      const p = window.PROJECTS[S.lang], step = p && p.steps[S.proj[S.lang] || 0];
      if (step) $("#bfb").innerHTML = `<div class="fb"><p class="hintbox" style="margin:0">💡 ${fmt(step.hint)}</p></div>`;
    } else if (act === "bsol") {
      const p = window.PROJECTS[S.lang], n = S.proj[S.lang] || 0, ed = el.closest(".editor");
      if (p && p.steps[n]) {
        window.projectBoxes(p, n + 1).forEach((b, i) => { ed.querySelectorAll("textarea.ci")[i].value = b.expected; });
        solStep = n + 1;
        $("#bfb").innerHTML = `<div class="fb"><p style="margin:0">Solution filled in. Read it, then tap <b>Check my code</b> to add the step. This step now earns 5 XP instead of 15.</p></div>`;
      }
    } else if (act === "run") {
      const p = window.PROJECTS[S.lang];
      if (p) runConsole(p, Math.min(S.proj[S.lang] || 0, p.steps.length), true);
    } else if (act === "hint" && cur) {
      cur.hinted = true;
      $("#hint").innerHTML = `<p class="hintbox">💡 ${fmt(cur.ch.hint)}</p>`;
    } else if (act === "reset") {
      if (confirm("Erase all progress, XP and streak on this device?")) { S = fresh(); save(); renderStats(); location.hash = "#/today"; route(); }
    }
  });
  // Keep the keyboard open on phones when tapping a symbol key
  document.addEventListener("mousedown", (e) => { if (e.target.closest(".key")) e.preventDefault(); });
  document.addEventListener("submit", (e) => {
    if (e.target.dataset.act !== "submit") return;
    e.preventDefault();
    if (cur && !cur.solved) checkTyped(new FormData(e.target).get("a") || "");
  });

  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [p, arg] = h.split("/");
    cur = p === "c" ? cur : null;
    runToken++;
    if (p !== "build") { solStep = 0; flash = ""; }
    if (p === "c") viewChallenge(arg);
    else if (p === "path") viewPath();
    else if (p === "build") viewBuild();
    else if (p === "tips") viewTips();
    else viewToday();
    renderStats();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !cur) route(); });
  route();

  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
