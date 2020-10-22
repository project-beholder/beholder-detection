// Line closest point
// p0 is point of interest, p1: start of line, p2: end of line
export function lineCP(p2, p0, p1) {
  var p10 = { x: p0.x - p1.x, y: p0.y - p1.y };
  var p12 = { x: p2.x - p1.x, y: p2.y - p1.y };
  var t = vecDot(p12, p10) / vecDot(p12, p12);
  var CPx = p1.x + t * p12.x;
  var CPy = p1.y + t * p12.y;

  return { x: CPx, y: CPy, t: t };
}

export default { lineCP };
