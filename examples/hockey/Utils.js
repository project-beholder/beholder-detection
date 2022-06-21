function clamp(min, max, v) {
  return v < min ? min : (v > max ? max: v); // lol ternary
}

function lerp(a, b, v) {
  return a + (b - a) * v;
}

function randomInt(low, high) {
  return low + Math.round(Math.random() * (high - low));
}

function easeOutElastic (t, b, c, d) {
  var s = 1.70158;
  s = s * 30;
  var p = 0;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * .3;
  if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
  }
  else var s = p / (2 * Math.PI) * Math.asin(c / a);
  return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
}
