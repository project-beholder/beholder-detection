export default class Vec2 {
  // Static stuff
  static sub(v1, v2) {
    return new Vec2(v2.x - v1.x, v2.y - v1.y);
  }

  static fromAngle(a) {
    return new Vec2(Math.cos(a), Math.sin(a));
  }

  static add(v1, v2) {
    return new Vec2(v2.x + v1.x, v2.y + v1.y);
  }

  static addScalar(v1, v2, s) {
    const x = v1.x + (v2.x * s);
    const y = v1.y + (v2.y * s);

    return new Vec2(x, y);
  }

  static mag(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y);
  }

  static angleBetween(v1, v2) {
    return Math.atan2(
      v1.x * v2.y - v1.y * v2.x,
      v1.x * v2.x + v1.y * v2.y
    );
  }

  static rotate(v, angle) {
    const x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
    const y = v.x * Math.sin(angle) + v.y * Math.cos(angle);
    return new Vec2(x, y);
  }

  static scale(v, s) {
    return new Vec2(v.x * s, v.y * s);
  }

  static dist(v1, v2) {
    return new Vec2(v2.x - v1.x, v2.y - v1.y).mag();
  }

  static dist2(v1, v2) {
    return new Vec2(v2.x - v1.x, v2.y - v1.y).mag2();
  }

  static normalize(v) {
    const m = v.mag();
    return new Vec2(v.x / m, v.y / m);
  }

  static copy(v) {
    return new Vec2(v.x, v.y);
  }

  // Instance methods
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  addScalar(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;

    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;

    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;

    return this;
  }

  mag() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  mag2() {
    return (this.x*this.x + this.y*this.y);
  }

  dist(v) {
    return Vec2.sub(this, v).mag();
  }

  dist2(v) {
    return Vec2.sub(this, v).mag2();
  }

  normalize() {
    const m = this.mag();
    this.x /= m;
    this.y /= m;

    return this;
  }

  getAngle() {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle) {
    const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = x;
    this.y = y;

    return this;
  }

  dot(v) {
    return (this.x * v.x) + (this.y * v.y);
  }

  angleBetween(v) {
    return Math.atan2(
      this.x * v.y - this.y * v.x,
      this.x * v.x + this.y * v.y
    );
  }
}
