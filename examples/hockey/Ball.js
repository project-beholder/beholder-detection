const BALL_COLORS = [
  '#ffffff',
  '#70D6FF',
  '#E9FF70',
  '#ffffff',
  '#FF70A6',
  '#FFD670',
  '#ffffff',
  '#FF9770',
  '#97FF70',
];

class Ball {
  constructor(x, y, xBound, yBound) {
    this.pos = new Vec2(x, y);
    this.fwd = new Vec2(1, 1); 
    this.size = 20;
    this.velocity = new Vec2(0, 0);
    this.speed = 0.05;
    this.xMax = xBound;
    this.yMax = yBound;

    this.canCollide = true;

    this.colorTimer = 0;
    this.color = 0;

    this.spawnTimer = 200;
  }

  reset() {
    spawnParticles(20, this.pos, 0.6, 400, 0.99);
    shakeScreen(5, 700);
    this.spawnTimer = 200;
    this.velocity.set(0,0);
    this.pos.set(this.xMax / 2, this.yMax / 2);
  }

  doBounce(force) {
    // this.speed = clamp(0, 1, this.speed + force);
    if (this.spawnTimer > 0) return;

    this.canCollide = false;
    this.collideTimer = 500;

    // this.angle = angle;
    this.velocity.add(force);
    if (this.velocity.mag() > 5) {
      this.velocity.normalize().scale(5);
    }

    spawnParticles(4, this.pos, 0.8, 200, 0.9);
    shakeScreen(5, 200);
  }

  update(dt) {
    if (this.spawnTimer >= 0) {
      this.spawnTimer -= dt;
      return;
    }

    this.pos.addScalar(this.velocity, dt);
    if (!this.canCollide && this.collideTimer > 0) this.collideTimer -= dt;
    else this.canCollide = true;

    if (this.pos.x < 0) {
      this.pos.x = 1;
      this.velocity.x *= -1;
    }
    if (this.pos.x > this.xMax) {
      this.pos.x = this.xMax - 1;
      this.velocity.x *= -1;
    }

    if (this.pos.y < 0) {
      this.pos.y = 1;
      this.velocity.y *= -1;
    }
    if (this.pos.y > this.yMax) {
      this.pos.y = this.yMax - 1;
      this.velocity.y *= -1;
    }

    // friction
    this.velocity.scale(0.995);

    this.colorTimer -= dt;
    if (this.colorTimer < 0) {
      this.color=randomInt(0, BALL_COLORS.length - 1);
      this.colorTimer = 40;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    if (this.spawnTimer <= 10) {
      // ctx.fillStyle = '#ffffff';
      ctx.fillStyle = BALL_COLORS[this.color];
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    } else if (this.spawnTimer < 2000) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();

      const r = lerp(0, 100, this.spawnTimer / 200);
      // console.log(r);
      ctx.arc(0, 0, r + 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
