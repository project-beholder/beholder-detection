class Paddle {
  constructor(x, y, goalColor, pid) {
    this.pid = pid;
    this.pos = new Vec2(x, y);
    this.targetPos = new Vec2(x, y);
    this.velocity = new Vec2(1, 1);
    // this.rot = 0.3;
    this.fwd = Vec2.fromAngle(0);
    this.targetFwd = Vec2.fromAngle(0);
    this.goalPos = new Vec2(0, 0);
    this.goalSize = 20;

    this.w = 32;
    this.h = 82;
    this.lengthSq = this.h * this.h;

    this.bumperOffset = new Vec2(0, 0);

    this.vert1 = this.fwd.clone().scale(25);
    this.vert2 = this.fwd.clone().scale(-25);

    this.state = 'REST'; // REST, LAUNCH, RETURN

    this.launchTimer = 0;
    this.launchForce = new Vec2(0, 0);
    this.speed = 0.01;

    this.goalColor = goalColor;
  }

  move(x, y) {
    this.targetPos.x = x;
    this.targetPos.y = y;
  }

  moveBy(delta) {
    this.pos.add(delta);
    this.pos.x = clamp(0, canvas.width, this.pos.x);
    this.pos.y = clamp(0, canvas.height, this.pos.y);
  }

  rotate(angle) {
    this.targetFwd.rotate(angle);
  }

  setRotation(angle) {
    this.targetFwd = Vec2.fromAngle(angle);
  }

  launch() {
    if (this.state != 'REST') return;
    this.launchTimer = 130;
    this.state = 'LAUNCH';

    this.launchForce = this.fwd.clone().rotate(-Math.PI / 2);
    this.launchVelocity = this.fwd.clone().rotate(-Math.PI / 2).scale(12);
  }

  getBallNormal(p) {
    const circleVec = Vec2.sub(this.vert1, p);
    const proj = this.axis.dot(circleVec) / this.axis.mag();
    const closestPoint = this.axis.clone().normalize().scale(proj);
    return Vec2.sub(circleVec, closestPoint).normalize();
  }

  // just the center and radius
  checkCircleCollision(p, r) {
    const rSq = (r-3) * (r-3);
    // Makes sure it's not off the point2 of the segment
    if (this.vert1.dist2(p) < rSq + this.lengthSq && this.vert2.dist2(p) < rSq + this.lengthSq) {
      // If the circle is close enough to the line to collide
      const circleVec = Vec2.sub(this.vert1, p);
      const proj = this.axis.dot(circleVec) / this.axis.mag();
      const closestPoint = this.axis.clone().normalize().scale(proj);
      if (closestPoint.dist2(circleVec) < rSq) return true;
    }

    // Otherwise no
    return false;
  }

  runBallCollision(ball) {
    // paddle
    if (ball.canCollide && this.checkCircleCollision(ball.pos, ball.size)) {
      // do bounce
      // const newDir = this.getReflection(ball.pos, ball.fwd);

      // CHANGE THIS TO USE LAUNCH VELOCITY IN LAUNCH STATE, OR MAYBE ALWAYS USE PADDLE FWD
      if (this.state == 'LAUNCH') ball.doBounce(this.launchVelocity.clone().scale(0.1));
      else ball.doBounce(this.getBallNormal(ball.pos).scale(-0.05));
    }

    if (this.pos.dist(ball.pos) < this.goalSize + ball.size) {
      ball.reset();
      scoreGoal(this.pid);
    }
  }

  update(dt) {
    switch(this.state) {
      case 'LAUNCH':
        this.launchTimer -= dt;
        // this.launchVelocity.addScalar(this.launchForce, dt);
        this.bumperOffset.add(this.launchVelocity, dt);

        if (this.launchTimer < 0) this.state = 'RETURN';
        break;

      case 'REST':
        this.bumperOffset.copy(this.fwd).rotate(-Math.PI / 2).scale(this.w);
        this.fwd.x = lerp(this.fwd.x, this.targetFwd.x, 0.02 * dt);
        this.fwd.y = lerp(this.fwd.y, this.targetFwd.y, 0.02 * dt);
        break;

      case 'RETURN':
        this.bumperOffset.set(
          lerp(this.bumperOffset.x, 0, 0.02 * dt),
          lerp(this.bumperOffset.y, 0, 0.02 * dt)
        );

        if (this.bumperOffset.mag() < this.w * 0.7) this.state = 'REST';
        break;

      default: break;
    }

    // this.pos.x = lerp(this.pos.x, this.targetPos.x, 0.002 * dt);
    // this.pos.y = lerp(this.pos.y, this.targetPos.y, 0.002 * dt);

    this.vert1 = this.fwd.clone().scale(this.h / 2).add(this.pos).add(this.bumperOffset);
    this.vert2 = this.fwd.clone().scale(-this.h / 2).add(this.pos).add(this.bumperOffset);

    this.axis = Vec2.sub(this.vert1, this.vert2);

  }

  draw(ctx) {

    // draw goal
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    ctx.fillStyle = this.goalColor;
    ctx.beginPath();
    ctx.arc(0,0, this.goalSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0,0, this.goalSize * 1.4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    // draw bumper
    ctx.save();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = this.w * 0.35;
    ctx.beginPath();
    ctx.moveTo(this.vert1.x, this.vert1.y);
    ctx.lineTo(this.vert2.x, this.vert2.y);
    ctx.stroke();

    ctx.restore();
  }
}
