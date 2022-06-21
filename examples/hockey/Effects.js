let particles = [];

let shakeTime = 0;
let shakeTotal = 0;
let shakeOffset = new Vec2(0, 0);

function spawnParticles(amount, pos, force, time, friction) {
  for (let i = 0; i < amount; i++) {
    const newParticle = {
      currPos: pos.clone(),
      prevPos: pos.clone(),
      velocity: Vec2.fromAngle(Math.random() * 2 * Math.PI).scale(force),
      liveTime: time + Math.random() * 50 - 25,
      friction: friction,
    }

    particles.push(newParticle);
  }
}

function updateParticles(dt) {
  let pToRemove = -1;
  particles.forEach((p, index) => {
    p.prevPos.copy(p.currPos);
    p.velocity.scale(p.friction);
    p.currPos.addScalar(p.velocity, dt);

    p.liveTime -= dt;

    if (p.liveTime < 0) pToRemove = index;
  });

  if (pToRemove >= 0) particles.splice(pToRemove, 1);
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.save();

    ctx.strokeStyle = BALL_COLORS[randomInt(0, Math.random() * BALL_COLORS.length - 1)];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.currPos.x, p.currPos.y);
    ctx.lineTo(p.prevPos.x, p.prevPos.y);
    ctx.stroke();

    ctx.restore();
  });
}

function shakeScreen(mag, time) {
 shakeOffset.set(mag, 0);
 shakeOffset.rotate(Math.random() * 6.28);
 shakeTime = time;
 shakeTotal = time;
}
