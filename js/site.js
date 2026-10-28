(() => {
  const $ = (id) => document.getElementById(id);

  // Nav turns solid once the hero has scrolled away.
  const nav = $("nav"), hero = $("top");
  new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-88px 0px 0px 0px" }).observe(hero);

  // Mobile menu: a native dialog keeps focus inside and closes on Esc.
  const sheet = $("sheet"), open = $("menu-open");
  open.addEventListener("click", () => { sheet.showModal(); open.setAttribute("aria-expanded", "true"); });
  const close = () => { sheet.close(); open.setAttribute("aria-expanded", "false"); };
  $("menu-close").addEventListener("click", close);
  sheet.addEventListener("click", (e) => { if (e.target.tagName === "A") close(); });
  sheet.addEventListener("close", () => open.setAttribute("aria-expanded", "false"));

  // Reviews render only once a reviewer has agreed to be quoted ("approved": true).
  try {
    const reviews = JSON.parse($("reviews-data").textContent).filter((r) => r.approved);
    if (reviews.length) {
      const box = $("quotes");
      for (const r of reviews.slice(0, 3)) {
        const f = document.createElement("figure"), q = document.createElement("blockquote"), c = document.createElement("figcaption");
        q.textContent = r.text; c.textContent = `${r.name} · Google · ${r.service}`;
        f.append(q, c); box.append(f);
      }
      box.hidden = false;
    }
  } catch (_) { /* no reviews block */ }

  // Bridal enquiry: inline errors; on the live site the form posts to a Cloudflare Pages Function.
  const form = $("enq");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const checks = [
      ["f-name", "e-name", (v) => v.trim() ? "" : "Please add your name."],
      ["f-email", "e-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please add an email we can reply to."],
      ["f-date", "e-date", (v) => v ? "" : "Please add the wedding date."],
    ];
    let first = null;
    for (const [f, err, test] of checks) {
      const msg = test($(f).value);
      $(err).textContent = msg; $(f).setAttribute("aria-invalid", String(!!msg));
      if (msg) $(f).setAttribute("aria-describedby", err); else $(f).removeAttribute("aria-describedby");
      if (msg && !first) first = $(f);
    }
    const ok = $("f-ok").checked;
    $("e-ok").textContent = ok ? "" : "Please tick the box so we can reply.";
    if (!ok && !first) first = $("f-ok");
    if (first) { first.focus(); return; }
    if (form.company.value) return; // honeypot
    const done = document.createElement("p");
    done.className = "sent"; done.setAttribute("role", "status");
    done.textContent = "Thank you. Laura will be in touch about your date within two working days.";
    form.replaceChildren(done);
  });

  // Open-now dial. Example hours until the salon confirms; times are read in Europe/London.
  const HOURS = { Mon: null, Tue: [9, 17], Wed: [9, 17], Thu: [9, 20], Fri: [9, 17], Sat: [8.5, 15], Sun: null };
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = get("weekday"), now = +get("hour") + +get("minute") / 60;
  const fmt = (h) => { const hh = Math.floor(h), m = Math.round((h - hh) * 60); return ((hh + 11) % 12 + 1) + (m ? ":" + String(m).padStart(2, "0") : "") + (hh >= 12 ? "pm" : "am"); };
  // A 12-hour clock face: the copper arc is today's opening hours, the hand is the time now.
  const pt = (h, r) => { const a = ((h % 12) / 12) * 2 * Math.PI - Math.PI / 2; return [84 + r * Math.cos(a), 84 + r * Math.sin(a)]; };
  const ticks = $("dial-ticks");
  for (let h = 0; h < 12; h++) {
    const [x1, y1] = pt(h, h % 3 ? 75 : 69), [x2, y2] = pt(h, 80);
    ticks.insertAdjacentHTML("beforeend", `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`);
  }
  const today = HOURS[day];
  if (today) { const [a, b] = today, [x1, y1] = pt(a, 64), [x2, y2] = pt(b, 64); $("dial-arc").setAttribute("d", `M${x1} ${y1}A64 64 0 ${b - a > 6 ? 1 : 0} 1 ${x2} ${y2}`); }
  const [hx, hy] = pt(now, 52); $("dial-hand").setAttribute("x2", hx); $("dial-hand").setAttribute("y2", hy);
  let state;
  if (today && now >= today[0] && now < today[1]) state = "Open until " + fmt(today[1]);
  else {
    let next = today && now < today[0] ? [null, today[0]] : null;
    for (let k = 1; !next && k <= 7; k++) { const d = DAYS[(DAYS.indexOf(day) + k) % 7]; if (HOURS[d]) next = [k === 1 ? "tomorrow" : d, HOURS[d][0]]; }
    state = "Closed · opens " + (next[0] ? next[0] + " " : "") + fmt(next[1]);
  }
  $("dial-state").textContent = state;
  $("hours").innerHTML = DAYS.map((d) => `<li class="${d === day ? "today" : ""}"><span>${d}</span><span>${HOURS[d] ? fmt(HOURS[d][0]) + "–" + fmt(HOURS[d][1]) : "Closed"}</span></li>`).join("");

  // The Hairline chair: mounts the figure the way the package does, then walks its tour
  // while it is on screen until a real pointer arrives (it holds still under reduced motion).
  window.hairline = (figure) => {
    const stage = $("chair"), out = $("chair-read");
    HL.inject(document);
    stage.setAttribute("data-hairline", figure.name);
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", "A stylist's chair on its hydraulic base beside a trolley with scissors. It swivels to face the pointer.");
    const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
    const read = { set textContent(v) { out.textContent = v; }, get textContent() { return out.textContent; } };
    figure.mount({ stage, svg, read }, figure.range[1]);
    if (!HL.reducedMotion()) {
      let lap = null;
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !lap) lap = HL.tour(stage, figure.tour, () => {});
        else if (!e.isIntersecting && lap) { lap.stop(); lap = null; }
      }, { threshold: 0.4 }).observe(stage);
    }
  };
})();
