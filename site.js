/* Progressive enhancement only: theme toggle and local search.
   All ordinary content works without JavaScript. Nothing is logged or transmitted. */
(function () {
  "use strict";

  /* Theme toggle, persisted in localStorage */
  var root = document.documentElement;
  var KEY = "runes-theme";
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  apply(stored());

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.hidden = false;
    var label = function () {
      toggle.textContent = current() === "dark" ? "Limestone" : "Granite";
      toggle.setAttribute("aria-label", current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    };
    label();
    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
      label();
    });
    /* Keep the label truthful if the system theme changes and no
       explicit choice has been stored. */
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () { if (!stored()) label(); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* Local search over search-index.json */
  var box = document.getElementById("search");
  var input = document.getElementById("q");
  var results = document.getElementById("search-results");
  if (!box || !input || !results) return;
  box.hidden = false;

  var index = null;
  var loading = false;
  function loadIndex(cb) {
    if (index) { cb(); return; }
    if (loading) return;
    loading = true;
    fetch("search-index.json").then(function (r) { return r.json(); }).then(function (data) {
      index = data;
      cb();
    }).catch(function () {
      loading = false;
    });
  }

  function norm(s) { return s.toLowerCase(); }

  function score(entry, terms) {
    var title = norm(entry.title);
    var text = norm(entry.text || "");
    var aliases = (entry.aliases || []).map(norm);
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var s = 0;
      if (title.indexOf(t) !== -1) s = title.indexOf(t) === 0 ? 6 : 4;
      else if (aliases.some(function (a) { return a.indexOf(t) !== -1; })) s = 5;
      else if (text.indexOf(t) !== -1) s = 1;
      if (s === 0) return 0;
      total += s;
    }
    return total;
  }

  var active = -1;
  function render(list, query) {
    results.innerHTML = "";
    active = -1;
    if (!query) { results.hidden = true; return; }
    results.hidden = false;
    if (list.length === 0) {
      var li = document.createElement("li");
      li.className = "empty";
      li.textContent = "Nothing carved under “" + query + "”. Try a tag name (“pointer”), a concept (“cenotaph”), or “vectors”.";
      results.appendChild(li);
      return;
    }
    list.slice(0, 10).forEach(function (e) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = e.page + (e.anchor ? "#" + e.anchor : "");
      a.textContent = e.title;
      var where = document.createElement("span");
      where.className = "where";
      where.textContent = e.where;
      a.appendChild(where);
      li.appendChild(a);
      results.appendChild(li);
    });
  }

  function run() {
    var query = input.value.trim();
    if (!query) { render([], ""); return; }
    loadIndex(function () {
      var terms = norm(query).split(/\s+/).filter(Boolean);
      var scored = [];
      for (var i = 0; i < index.length; i++) {
        var s = score(index[i], terms);
        if (s > 0) scored.push({ s: s, e: index[i] });
      }
      scored.sort(function (a, b) { return b.s - a.s; });
      render(scored.map(function (x) { return x.e; }), query);
    });
  }

  input.addEventListener("input", run);
  input.addEventListener("focus", function () { loadIndex(function () {}); });

  input.addEventListener("keydown", function (ev) {
    var links = results.querySelectorAll("a");
    if (ev.key === "ArrowDown" && links.length) {
      ev.preventDefault();
      active = Math.min(active + 1, links.length - 1);
      highlight(links);
    } else if (ev.key === "ArrowUp" && links.length) {
      ev.preventDefault();
      active = Math.max(active - 1, 0);
      highlight(links);
    } else if (ev.key === "Enter" && active >= 0 && links[active]) {
      ev.preventDefault();
      links[active].click();
    } else if (ev.key === "Escape") {
      input.value = "";
      render([], "");
      input.blur();
    }
  });

  function highlight(links) {
    links.forEach(function (l, i) { l.classList.toggle("active", i === active); });
    if (links[active]) links[active].scrollIntoView({ block: "nearest" });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (document.activeElement && document.activeElement.isContentEditable)) return;
      ev.preventDefault();
      input.focus();
    }
  });

  document.addEventListener("click", function (ev) {
    if (!box.contains(ev.target)) { results.hidden = true; }
  });
})();
