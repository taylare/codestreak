/* Checks code a learner typed against the expected code for a project step.
   It can't compile anything. Instead it ignores spacing, line breaks and comments, then compares
   statement by statement and explains each mismatch. Exposes window.CodeCheck. */
(function () {
  const PUNCT = "(){}\\[\\];,.<>=+\\-*\\/%!?:&|";
  const STRIP_SPACES = new RegExp(` ?([${PUNCT}]) ?`, "g");

  // Remove // comments that are not inside a string
  function stripComments(code) {
    return code.split("\n").map((line) => {
      let inStr = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inStr && c === "\\") { i++; continue; }
        if (c === '"') inStr = !inStr;
        else if (!inStr && c === "/" && line[i + 1] === "/") return line.slice(0, i);
      }
      return line;
    }).join("\n");
  }

  // Whitespace-insensitive form. Text inside "strings" is kept exactly as typed.
  function norm(code) {
    return stripComments(code)
      .split(/("(?:\\.|[^"\\\n])*")/)
      .map((seg, i) => (i % 2 ? seg : seg.replace(/\s+/g, " ").replace(STRIP_SPACES, "$1")))
      .join("").trim();
  }

  const units = (n) => n.match(/[^;]*;|[^;]+$/g) || [];

  function lev(a, b) {
    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diag = prev[0];
      prev[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = prev[j];
        prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
        diag = tmp;
      }
    }
    return prev[b.length];
  }

  // Count brackets outside strings, and quotes overall
  function balance(code) {
    const outside = stripComments(code).split(/("(?:\\.|[^"\\\n])*")/).filter((_, i) => i % 2 === 0).join("");
    const count = (re) => (outside.match(re) || []).length;
    const quotes = (stripComments(code).match(/(?<!\\)"/g) || []).length;
    return {
      braces: [count(/\{/g), count(/\}/g)],
      parens: [count(/\(/g), count(/\)/g)],
      squares: [count(/\[/g), count(/\]/g)],
      quotesOdd: quotes % 2 === 1
    };
  }

  const peek = (u) => "`" + u.slice(0, 20) + (u.length > 20 ? "…" : "") + "`";
  const show = (u) => "`" + (u.length > 60 ? u.slice(0, 60) + "…" : u) + "`";

  // Explain how one typed statement differs from the expected one
  function explain(u, e) {
    if (u.toLowerCase() === e.toLowerCase()) return `${show(u)}: capital letters matter. Check names like \`Console\`, \`WriteLine\`, \`List\`, \`std\` and your variable names.`;
    if (u + ";" === e) return `Missing semicolon at the end of ${show(u)}.`;
    if (u.replace(/[{}]/g, "") === e.replace(/[{}]/g, "")) return `Check the braces \`{ }\` around ${show(u)}.`;
    let i = 0;
    while (i < u.length && i < e.length && u[i] === e[i]) i++;
    const near = u.slice(Math.max(0, i - 6), i + 10);
    return `${show(u)} is close but differs near \`${near}\`. Re-read the task and compare each word, symbol and quote.`;
  }

  function mixups(code, lang) {
    const tips = [];
    if (lang === "cs") {
      if (/\bprint\s*\(|\bprintln\b|System\.out|\bprintf\b|console\.log|\bcout\b/.test(code)) tips.push("That looks like another language's print. In C# you print with `Console.WriteLine(...)`.");
    } else {
      if (/(^|[^:\w])cout\b/.test(code)) tips.push("Write `std::cout`. `cout` lives in the `std` namespace.");
      if (/std::endl|\bendl\b/.test(code)) tips.push("`std::endl` works in real C++, but this checker expects the `\"\\n\"` newline used in the task.");
      if (/\bprintf\b|\bConsole\./.test(code)) tips.push("That's C or C# printing. In C++ use `std::cout << ...`.");
      if (/\bcout\s*>>/.test(code)) tips.push("`>>` reads input. To print, use `<<`.");
    }
    return tips;
  }

  /* diagnose(typed, expected, lang) -> { ok, tips[] } */
  function diagnose(typed, expected, lang) {
    const nu = norm(typed), ne = norm(expected);
    if (!nu) return { ok: false, tips: ["This box is empty. Type the code described in the task."] };
    if (nu === ne) return { ok: true, tips: [] };

    const tips = mixups(typed, lang);
    const b = balance(typed);
    if (b.quotesOdd) tips.push('A quote `"` is missing its partner. Every string needs an opening and a closing quote.');
    if (b.braces[0] !== b.braces[1]) tips.push(`Braces don't match: ${b.braces[0]} \`{\` but ${b.braces[1]} \`}\`.`);
    if (b.parens[0] !== b.parens[1]) tips.push(`Brackets don't match: ${b.parens[0]} \`(\` but ${b.parens[1]} \`)\`.`);
    if (b.squares[0] !== b.squares[1]) tips.push(`Square brackets don't match: ${b.squares[0]} \`[\` but ${b.squares[1]} \`]\`.`);

    const U = units(nu), E = units(ne), left = U.slice(), missing = [];
    for (const e of E) {
      const i = left.indexOf(e);
      i >= 0 ? left.splice(i, 1) : missing.push(e);
    }
    for (const e of missing) {
      let best = -1, bestD = Infinity;
      left.forEach((u, i) => { const d = lev(u, e); if (d < bestD) { bestD = d; best = i; } });
      if (best >= 0 && bestD <= Math.max(e.length, left[best].length) * 0.6) {
        tips.push(explain(left[best], e));
        left.splice(best, 1);
      } else {
        tips.push(`Missing a statement that starts like ${peek(e)}`);
      }
    }
    left.forEach((u) => tips.push(`Extra code that this step doesn't need: ${show(u)}`));
    if (!missing.length && !left.length && !tips.length) tips.push("All the pieces are there, but in a different order or with different braces. Follow the order in the task.");
    return { ok: false, tips: [...new Set(tips)].slice(0, 5) };
  }

  window.CodeCheck = { norm, diagnose };
})();
