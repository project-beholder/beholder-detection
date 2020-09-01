import * as mathjs from 'mathjs';

export function calDistortionMatrices(q1, q2, q3, q4, r1, r2, r3, r4) {
  const matrixA = mathjs.matrix([
    [r1.x, r1.y, 1, 0, 0, 0, -q1.x * r1.x, -q1.x * r1.y],
    [0, 0, 0, r1.x, r1.y, 1, -q1.y * r1.x, -q1.y * r1.y],
    [r2.x, r2.y, 1, 0, 0, 0, -q2.x * r2.x, -q2.x * r2.y],
    [0, 0, 0, r2.x, r2.y, 1, -q2.y * r2.x, -q2.y * r2.y],
    [r3.x, r3.y, 1, 0, 0, 0, -q3.x * r3.x, -q3.x * r3.y],
    [0, 0, 0, r3.x, r3.y, 1, -q3.y * r3.x, -q3.y * r3.y],
    [r4.x, r4.y, 1, 0, 0, 0, -q4.x * r4.x, -q4.x * r4.y],
    [0, 0, 0, r4.x, r4.y, 1, -q4.y * r4.x, -q4.y * r4.y]
  ]);

  const matrixB = mathjs.matrix([
    [q1.x],
    [q1.y],
    [q2.x],
    [q2.y],
    [q3.x],
    [q3.y],
    [q4.x],
    [q4.y]
  ]);

  const s = mathjs.lusolve(matrixA, matrixB);

  return mathjs.matrix([
    [
      mathjs.subset(s, mathjs.index(0, 0)),
      mathjs.subset(s, mathjs.index(1, 0)),
      mathjs.subset(s, mathjs.index(2, 0))
    ],
    [
      mathjs.subset(s, mathjs.index(3, 0)),
      mathjs.subset(s, mathjs.index(4, 0)),
      mathjs.subset(s, mathjs.index(5, 0))
    ],
    [mathjs.subset(s, mathjs.index(6, 0)), mathjs.subset(s, mathjs.index(7, 0)), 1]
  ]);
}

// transformation of v using matrix m
// v = 2D vector of the format {x:X, y:Y}
export function matrixTransform(m, v) {
  const matrixV = mathjs.matrix([[v.x], [v.y], [1]]);

  const result = mathjs.multiply(m, matrixV);

  return {
    x:
      mathjs.subset(result, mathjs.index(0, 0)) /
      mathjs.subset(result, mathjs.index(2, 0)),
    y:
      mathjs.subset(result, mathjs.index(1, 0)) /
      mathjs.subset(result, mathjs.index(2, 0)),
  };
}
