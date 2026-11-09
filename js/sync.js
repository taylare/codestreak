/* Save token: move your progress between devices with no server.
   A token is your progress (completed lessons, XP, streak, project steps) packed into one
   copy-and-paste string. Nothing is uploaded anywhere. Exposes window.Sync:
     Sync.encode(state)            -> Promise<string>   build a token from the app state
     Sync.decode(token)            -> Promise<snapshot> read and strictly validate a token
     Sync.merge(state, snapshot)   -> new state         combine this device with the token
     Sync.replace(state, snapshot) -> new state         make this device match the token
   A token is not a password. It holds no personal data, and anyone who has it can load your progress. */
(function () {
  const VERSION = 1;
  const PREFIX_ZIP = "CS1.";   // gzip-compressed JSON
  const PREFIX_RAW = "CS0.";   // plain JSON, used when the browser cannot compress
  const MAX_TOKEN_CHARS = 100000;   // refuse absurdly large pastes
  const MAX_JSON_BYTES = 200000;    // stop decompressing if the output gets bigger than this (zip-bomb guard)
  const MAX_LESSONS = 1000;
  const LANGS = ["cs", "cpp"];
  const ID_PATTERN = /^(?:cs|cpp)-[bia]\d{1,3}$/;      // e.g. cs-b12, cpp-a7
  const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;           // e.g. 2026-11-10
  const XP_PER_FIRST_TRY = 10, XP_PER_LATER_TRY = 5, XP_PER_PROJECT_STEP = 15;

  const canCompress = typeof CompressionStream === "function" && typeof DecompressionStream === "function";

  /* ---------- small helpers ---------- */
  const fail = (message) => { throw new Error(message); };
  const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const clampInt = (v, min, max, fallback) => (Number.isInteger(v) && v >= min && v <= max ? v : fallback);

  // Bytes <-> base64url (URL-safe, no padding, so it survives chat apps and email)
  function toBase64Url(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function fromBase64Url(text) {
    if (!/^[A-Za-z0-9_-]*$/.test(text)) fail("That does not look like a CodeStreak token.");
    const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (text.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  // Run bytes through a compression or decompression stream, refusing output above maxBytes
  async function pipeBytes(bytes, transform, maxBytes) {
    const reader = new Blob([bytes]).stream().pipeThrough(transform).getReader();
    const chunks = [];
    let total = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) { await reader.cancel(); fail("That token is too large to be a CodeStreak token."); }
      chunks.push(value);
    }
    const out = new Uint8Array(total);
    let offset = 0;
    chunks.forEach((chunk) => { out.set(chunk, offset); offset += chunk.length; });
    return out;
  }

  /* ---------- snapshot: the part of the app state worth carrying ---------- */
  // Streak is stored with its date, so a stale streak is recognised as stale after importing
  function snapshot(state) {
    const done = {};
    Object.keys(state.done || {}).forEach((id) => {
      if (ID_PATTERN.test(id)) done[id] = [state.done[id].on, state.done[id].tries];
    });
    const proj = {};
    LANGS.forEach((lang) => { proj[lang] = (state.proj && state.proj[lang]) || 0; });
    return { v: VERSION, done, xp: state.xp || 0, streak: state.streak || 0, best: state.best || 0, last: state.last || "", lang: state.lang || "cs", proj };
  }

  // Rebuild a snapshot from untrusted data. Only known fields with the right shape survive.
  function sanitise(raw) {
    if (!isPlainObject(raw) || raw.v !== VERSION) fail("This token was made by a different version of CodeStreak.");
    const clean = { v: VERSION, done: {}, proj: {} };
    const entries = isPlainObject(raw.done) ? Object.entries(raw.done) : [];
    if (entries.length > MAX_LESSONS) fail("That token has too many lessons in it.");
    entries.forEach(([id, value]) => {
      // ids must match the lesson id pattern, which also rules out names like "__proto__"
      if (!ID_PATTERN.test(id) || !Array.isArray(value) || !DAY_PATTERN.test(String(value[0]))) return;
      clean.done[id] = { on: value[0], tries: clampInt(value[1], 1, 99, 1) };
    });
    clean.xp = clampInt(raw.xp, 0, 1000000, 0);
    clean.streak = clampInt(raw.streak, 0, 10000, 0);
    clean.best = clampInt(raw.best, 0, 10000, 0);
    clean.last = typeof raw.last === "string" && DAY_PATTERN.test(raw.last) ? raw.last : "";
    clean.lang = LANGS.includes(raw.lang) ? raw.lang : "cs";
    LANGS.forEach((lang) => { clean.proj[lang] = clampInt(isPlainObject(raw.proj) ? raw.proj[lang] : 0, 0, 500, 0); });
    return clean;
  }

  /* ---------- encode and decode ---------- */
  async function encode(state) {
    const bytes = new TextEncoder().encode(JSON.stringify(snapshot(state)));
    if (!canCompress) return PREFIX_RAW + toBase64Url(bytes);
    return PREFIX_ZIP + toBase64Url(await pipeBytes(bytes, new CompressionStream("gzip"), MAX_JSON_BYTES));
  }

  async function decode(token) {
    // People paste tokens with line breaks or spaces from chat apps, so strip all whitespace first
    const text = String(token || "").replace(/\s+/g, "");
    if (!text) fail("Paste a token first.");
    if (text.length > MAX_TOKEN_CHARS) fail("That is too long to be a CodeStreak token.");
    let bytes;
    if (text.startsWith(PREFIX_ZIP)) {
      if (!canCompress) fail("This browser cannot read compressed tokens. Try a newer browser.");
      try {
        bytes = await pipeBytes(fromBase64Url(text.slice(PREFIX_ZIP.length)), new DecompressionStream("gzip"), MAX_JSON_BYTES);
      } catch (e) {
        fail(e.message.includes("too large") ? e.message : "That token looks damaged. Copy it again in full.");
      }
    } else if (text.startsWith(PREFIX_RAW)) {
      bytes = fromBase64Url(text.slice(PREFIX_RAW.length));
    } else fail("That does not look like a CodeStreak token. It should start with CS1.");
    let raw;
    try { raw = JSON.parse(new TextDecoder().decode(bytes)); } catch { fail("That token looks damaged. Copy it again in full."); }
    return sanitise(raw);
  }

  /* ---------- combining progress ---------- */
  // Estimated XP the other side earned that this side lacks (lessons and project steps it has not got)
  function missingXp(from, other) {
    let xp = 0;
    Object.keys(from.done).forEach((id) => {
      if (!other.done[id]) xp += from.done[id].tries === 1 ? XP_PER_FIRST_TRY : XP_PER_LATER_TRY;
    });
    LANGS.forEach((lang) => { xp += Math.max(0, (from.proj[lang] || 0) - (other.proj[lang] || 0)) * XP_PER_PROJECT_STEP; });
    return xp;
  }

  // Keep this device's daily pick and recent mistakes, which are not part of a token
  const withLocalExtras = (state, merged) => Object.assign({}, state, merged, { daily: state.daily || {}, mistakes: state.mistakes || [] });

  function merge(state, snap) {
    const local = snapshot(state);
    const done = {};
    // union of completed lessons; if both devices finished one, keep the earlier completion
    [local.done, snap.done].forEach((source) => {
      Object.keys(source).forEach((id) => {
        const entry = Array.isArray(source[id]) ? { on: source[id][0], tries: source[id][1] } : source[id];
        if (!done[id] || entry.on < done[id].on) done[id] = { on: entry.on, tries: entry.tries };
      });
    });
    const localSnap = Object.assign({}, local, { done: Object.fromEntries(Object.entries(local.done).map(([id, v]) => [id, { on: v[0], tries: v[1] }])) });
    // XP cannot be summed (shared lessons would count twice), so estimate the union from both sides and take the higher
    const xp = Math.max(localSnap.xp + missingXp(snap, localSnap), snap.xp + missingXp(localSnap, snap));
    // the streak with the more recent activity wins; on a tie take the longer one
    const snapWins = snap.last > local.last || (snap.last === local.last && snap.streak > local.streak);
    const proj = {};
    LANGS.forEach((lang) => { proj[lang] = Math.max(local.proj[lang], snap.proj[lang]); });
    return withLocalExtras(state, {
      done, xp, proj,
      streak: snapWins ? snap.streak : local.streak,
      last: snapWins ? snap.last : local.last,
      best: Math.max(local.best, snap.best, snapWins ? snap.streak : local.streak)
    });
  }

  function replace(state, snap) {
    return withLocalExtras(state, { done: snap.done, xp: snap.xp, streak: snap.streak, best: snap.best, last: snap.last, proj: snap.proj });
  }

  window.Sync = { encode, decode, merge, replace };
})();
