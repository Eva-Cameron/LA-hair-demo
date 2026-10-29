/**
 * Chair: a stylist's chair on its round hydraulic base, beside a trolley with
 * a pair of scissors on its top. The pointer is projected onto the ground and
 * the chair swivels on its column to face it, on a spring, clamped to a reach
 * either side of its rest turn. At rest the chair sits three-quarter on, and
 * the scissors carry the bright stroke; once the chair is turned, the bright
 * moves to its back. The slider is the reach, in degrees.
 *
 * The pattern: a single continuous answer (one spring on an angle), a hit test
 * on the ground plane, and paint order re-sorted by depth as the chair turns.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, open, poly, prism, proj, rad, ringAt, rings,
  spring, stepS, flatDot, mk, place, pointer, put, register, disposer, solid, unproj,
} = HL;

const REST = 72, SX = 38, SY = -22, TOP = 22.5;

/** A ring turned by th radians about the origin, then moved to (ox, oy); normals turn with it. */
const turn = (ring, th, ox = 0, oy = 0) => {
  const c = Math.cos(th), s = Math.sin(th);
  return ring.map((q) => ({ u: ox + q.u * c - q.v * s, v: oy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
/** A curved back's footprint: the band of a circle of radius r behind the seat, from -a to +a either side of straight back, its two ends rounded. */
const barrel = (r, t, a, n = 14) => {
  const out = [], A = rad(a);
  for (let k = 0; k <= n; k++) { const th = Math.PI - A + (2 * A * k) / n, c = Math.cos(th), s = Math.sin(th); out.push({ u: r * c, v: r * s, nu: c, nv: s }); }
  for (let k = 0; k <= 4; k++) { const e = Math.PI + A + (Math.PI * k) / 4, c0 = Math.cos(Math.PI + A), s0 = Math.sin(Math.PI + A), c = Math.cos(e), s = Math.sin(e);
    out.push({ u: (r - t / 2) * c0 + (t / 2) * c * 1, v: (r - t / 2) * s0 + (t / 2) * s, nu: c, nv: s }); }
  for (let k = n; k >= 0; k--) { const th = Math.PI - A + (2 * A * k) / n, c = Math.cos(th), s = Math.sin(th); out.push({ u: (r - t) * c, v: (r - t) * s, nu: -c, nv: -s }); }
  for (let k = 0; k <= 4; k++) { const e = Math.PI - A + Math.PI + (Math.PI * k) / 4, c0 = Math.cos(Math.PI - A), s0 = Math.sin(Math.PI - A), c = Math.cos(e), s = Math.sin(e);
    out.push({ u: (r - t / 2) * c0 + (t / 2) * c, v: (r - t / 2) * s0 + (t / 2) * s, nu: c, nv: s }); }
  return out;
};
const wrap = (d) => ((d % 360) + 540) % 360 - 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  const reach = [];
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; reach.push([22 * Math.cos(a), 22 * Math.sin(a), 62]); }
  fit(C, [[-30, -40, -4], [56, -40, -4], [56, 30, -4], [-30, 30, -4], ...reach], 200, 166);
  const P = proj(C), front = facing(C);
  const depth = (x, y) => (x + y) * Math.SQRT1_2;
  let MAX = value, over = null;

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -40, 56, 30, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -4, 0));

  // The chair, in its own frame: forward is +u. Each part is [ring, inner, z0, z1].
  const R = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, b);
  const parts = {
    base: [circ(19, 48), circ(17.4, 48), 0, 3],
    pedal: [...R(-3, 18, 3, 26, 2, 0.8), 0.5, 2.5],
    column: [circ(3.6, 32), null, 3, 24],
    stem: [...R(3, -1.6, 18, 1.6, 1.2, 0.5), 9, 11],
    bar: [...R(17, -11, 21.5, 11, 2, 0.8), 8.5, 11.5],
    seat: [...R(-15, -14, 15, 14, 6, 1.6), 24, 31],
    armL: [...R(-11, 14, 12, 19, 2.5, 0.9), 24, 38],
    armR: [...R(-11, -19, 12, -14, 2.5, 0.9), 24, 38],
    back: [barrel(21, 4, 46), null, 30, 62],
  };
  const centre = { base: [0, 0], pedal: [0, 22], column: [0, 0], stem: [10, 0], bar: [19, 0], seat: [0, 0], armL: [0, 16.7], armR: [0, -16.7], back: [-19, 0] };
  const chair = mk("g", {}, g);
  const els = {};
  for (const k in parts) els[k] = solid(chair);

  // The trolley and the scissors on it: they never move.
  const tro = mk("g", {}, g);
  put(solid(tro), prism(P, front, turn(circ(8, 32), 0, SX, SY), turn(circ(6.8, 32), 0, SX, SY), 0, 1.5));
  put(solid(tro), prism(P, front, turn(circ(1.8, 16), 0, SX, SY), null, 1.5, TOP - 2));
  put(solid(tro), prism(P, front, turn(circ(12.5, 40), 0, SX, SY), turn(circ(11.2, 40), 0, SX, SY), TOP - 2, TOP));
  const phi = rad(-28), cp = Math.cos(phi), sp = Math.sin(phi);
  const S2 = (s, t) => P(SX + s * cp - t * sp, SY + s * sp + t * cp, TOP);
  /** One half of the scissors: a tapering blade from its handle to its tip, and the handle's ring. */
  const half = (side) => {
    const hs = -5, ht = 2.5 * side, ts = 11.5, tt = -0.5 * side;
    const L = Math.hypot(ts - hs, tt - ht), ns = -(tt - ht) / L, nt = (ts - hs) / L;
    const blade = fillet([[hs + ns * 0.9, ht + nt * 0.9], [ts, tt], [hs - ns * 0.9, ht - nt * 0.9]].map((p) => S2(p[0], p[1])), [0.4, 0.25, 0.4]);
    const ring = (r) => circ(r, 20).map((q) => S2(hs - 2.2 + q.u, ht + 0.9 * side + q.v));
    return { blade: mk("path", { class: "sil hi", d: poly(blade) }, tro), outer: mk("path", { class: "sil hi", d: poly(ring(2.5)) }, tro), hole: mk("path", { class: "nf", d: poly(ring(1.5)) }, tro) };
  };
  const scissors = [half(-1), half(1)];
  const pivot = flatDot(tro, C, 0.55, "dot");
  place(pivot, S2(2.9, 0));

  const sp0 = spring(REST, { eps: 0.05 });
  let drawn = NaN, lit = null;
  function draw() {
    const a = sp0.x;
    if (a === drawn) return;
    drawn = a;
    const th = rad(a), c = Math.cos(th), s = Math.sin(th);
    const order = [];
    for (const k in parts) {
      const [ring, inner, z0, z1] = parts[k];
      put(els[k], prism(P, front, turn(ring, th), inner && turn(inner, th), z0, z1));
      const [u, v] = centre[k];
      // Three layers, each sorted by depth: the floor, what stands under the seat, the seat and what sits on it.
      const layer = z1 <= 3 ? -2000 : z1 <= 24 ? -1000 : 0;
      order.push([k, layer + depth(u * c - v * s, u * s + v * c) + (k === "seat" ? -0.01 : 0)]);
    }
    order.sort((x, y) => x[1] - y[1]);
    for (const [k] of order) chair.appendChild(els[k].g);
  }
  function light() {
    const on = over !== null;
    if (on === lit) return;
    lit = on;
    els.back.sil.classList.toggle("hi", on);
    for (const h of scissors) { h.blade.classList.toggle("hi", !on); h.outer.classList.toggle("hi", !on); }
    pivot.setAttribute("class", on ? "dot m" : "dot");
  }

  const B = register(stage, (dt) => { const m = stepS(sp0, dt); draw(); light(); return m; });
  bag.add(B.unregister);

  function retarget() {
    if (!over) { sp0.t = REST; read.textContent = "rest"; B.wake(); return; }
    const want = Math.atan2(over[1], over[0]) * 180 / Math.PI;
    const d = clamp(wrap(want - REST), -MAX, MAX);
    // Keep the spring on the short way round from where it stands.
    sp0.t = sp0.x + wrap(REST + d - sp0.x);
    read.textContent = `turn ${d >= 0 ? "+" : "−"}${Math.abs(Math.round(d))}°`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); light();

  return {
    set: (v) => { MAX = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "chair",
  means: "A stylist's chair swivels on its hydraulic base to face the pointer; the scissors wait on the trolley.",
  rules: [1, 3, 4, 5, 9],
  range: [40, 80, 140],
  tour: [[110, 250], [300, 120], [90, 120], null],
  mount,
});
