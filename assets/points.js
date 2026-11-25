/* The figure on the home page.

   It draws every rational point (a/c, b/c) of the plane whose height
   max(|a|, |b|, |c|) is at most B, for coprime integers a, b, c with c > 0,
   inside a window around the origin. Points of smaller height get bigger dots.
   The points that lie on the circle x^2 + y^2 = 1 are drawn dark: there is
   one for each sign choice of each primitive Pythagorean triple.

   The two numbers in the caption are exact:
   - the number of points of height <= B in the projective plane, by Moebius
     inversion over the common divisor of (a, b, c);
   - the number of those on the circle, by direct search. */
(function () {
  'use strict';

  var root = document.querySelector('[data-points]');
  if (!root) return;

  var canvas = root.querySelector('canvas');
  var slider = root.querySelector('input[type="range"]');
  var playButton = root.querySelector('[data-play]');
  var outB = root.querySelectorAll('[data-b]');
  var outPlane = root.querySelector('[data-plane]');
  var outCircle = root.querySelector('[data-circle]');
  if (!canvas || !canvas.getContext || !slider) return;

  var MIN = Number(slider.min) || 2;
  var MAX = Number(slider.max) || 48;
  var HALF_WINDOW = 1.25;            // the window is [-1.25, 1.25] in both directions
  var DURATION = 2200;               // length of the build-up, in milliseconds

  var styles = getComputedStyle(document.documentElement);
  function colour(name, fallback) { return (styles.getPropertyValue(name) || '').trim() || fallback; }
  var RED = colour('--accent', '#B8231C');
  var INK = colour('--ink', '#1D1A19');
  var DISC = colour('--disc', '#F4EEE2');

  var frame = null;                  // the running animation frame, if any

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a;
  }

  function moebius(n) {
    var m = 1;
    for (var p = 2; p * p <= n; p++) {
      if (n % p === 0) { n /= p; if (n % p === 0) return 0; m = -m; }
    }
    if (n > 1) m = -m;
    return m;
  }

  // Points of the projective plane over Q with height at most B.
  function countPlane(B) {
    var total = 0;
    for (var d = 1; d <= B; d++) {
      var m = moebius(d);
      if (!m) continue;
      var n = Math.floor(B / d);
      total += m * (Math.pow(2 * n + 1, 3) - 1);
    }
    return total / 2;
  }

  // Rational points on x^2 + y^2 = 1 with height at most B.
  function countCircle(B) {
    var total = 0;
    for (var c = 1; c <= B; c++) {
      for (var a = -c; a <= c; a++) {
        var rest = c * c - a * a;
        var b = Math.round(Math.sqrt(rest));
        if (b * b !== rest) continue;
        if (gcd(gcd(a, b), c) !== 1) continue;
        total += b === 0 ? 1 : 2;
      }
    }
    return total;
  }

  function clamp(B) { return Math.max(MIN, Math.min(MAX, Math.round(Number(B) || MIN))); }

  function draw(B) {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (canvas.width !== pw) canvas.width = pw;
    if (canvas.height !== ph) canvas.height = ph;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var s = Math.min(w, h) / (2 * HALF_WINDOW);     // pixels per unit
    var cx = w / 2, cy = h / 2;
    var xmax = w / (2 * s), ymax = h / (2 * s);
    var scale = Math.min(w, h) / 430;               // keep dot sizes in proportion on small screens
    var onCircle = [];

    ctx.fillStyle = RED;
    for (var c = 1; c <= B; c++) {
      var amax = Math.min(B, Math.floor(xmax * c));
      var bmax = Math.min(B, Math.floor(ymax * c));
      for (var a = -amax; a <= amax; a++) {
        var g = gcd(a, c);
        for (var b = -bmax; b <= bmax; b++) {
          if (g !== 1 && gcd(g, b) !== 1) continue;
          var H = Math.max(Math.abs(a), Math.abs(b), c);
          var x = cx + (a / c) * s, y = cy - (b / c) * s;
          if (a * a + b * b === c * c) { onCircle.push([x, y, H]); continue; }
          var r = (4.6 * scale) / Math.pow(H, 0.85);
          ctx.globalAlpha = Math.min(1, 0.5 + 1.5 / H);
          if (r < 1) {
            var q = Math.max(r, 0.55);
            ctx.fillRect(x - q, y - q, 2 * q, 2 * q);
          } else {
            ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
          }
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, s, 0, 6.2832); ctx.stroke();

    for (var i = 0; i < onCircle.length; i++) {
      var p = onCircle[i];
      var rr = Math.max(2.4, (5.4 * scale) / Math.pow(p[2], 0.6));
      ctx.fillStyle = DISC;
      ctx.beginPath(); ctx.arc(p[0], p[1], rr + 1.6, 0, 6.2832); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, 6.2832); ctx.fill();
    }
  }

  var shown = null;

  // Draw the picture for height bound B and bring the slider and caption in line with it.
  function show(B) {
    B = clamp(B);
    shown = B;
    draw(B);
    if (Number(slider.value) !== B) slider.value = String(B);
    for (var i = 0; i < outB.length; i++) outB[i].textContent = String(B);
    if (outPlane) outPlane.textContent = countPlane(B).toLocaleString('en-US');
    if (outCircle) outCircle.textContent = String(countCircle(B));
  }

  function stop() {
    if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
  }

  // Let the picture build up from the smallest height to the target.
  function play(target) {
    stop();
    target = clamp(target);
    if (typeof requestAnimationFrame !== 'function' || target <= MIN) { show(target); return; }
    var start = null, last = 0;
    show(MIN);
    function step(now) {
      if (start === null) start = now;
      var k = Math.min(1, (now - start) / DURATION);
      if (k >= 1) { frame = null; show(target); return; }
      var eased = k * k * (3 - 2 * k);
      var B = Math.max(MIN, Math.round(MIN + (target - MIN) * eased));
      if (B !== last) { last = B; show(B); }
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
  }

  var resting = clamp(slider.value);     // the height the picture comes to rest at

  slider.addEventListener('input', function () {
    stop();
    resting = clamp(slider.value);
    show(resting);
  });

  if (playButton) {
    playButton.addEventListener('click', function () { play(resting); });
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function () { if (shown !== null) draw(shown); }).observe(canvas);
  } else {
    window.addEventListener('resize', function () { if (shown !== null) draw(shown); });
  }

  var calm = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) show(resting); else play(resting);
})();
