let canvas, ctx;

let ball, p1, p2;
let prevTime = Date.now();
let frameTime = 0;

let gameState = 'START'; // MAIN, OVER

function mainUpdate(dt) {
  ball.update(dt);
  p1.update(dt);
  p2.update(dt);

  p1.runBallCollision(ball);
  p2.runBallCollision(ball);
  updateParticles(dt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.save();

  // screem shakescosin
  if (shakeTime > 0) {
    shakeTime -= dt;
    ctx.translate(
      easeOutElastic((shakeTotal - shakeTime) / shakeTotal, shakeOffset.x, -shakeOffset.x, 3),
      easeOutElastic((shakeTotal - shakeTime) / shakeTotal, shakeOffset.y, -shakeOffset.y, 3),
    );
  }

  ball.draw(ctx);
  p1.draw(ctx);
  p2.draw(ctx);

  drawParticles();

  ctx.restore();
}

function update() {
  requestAnimationFrame(update);

  const currTime = Date.now();
  const dt = currTime - prevTime;
  prevTime = currTime;

  frameTime -= dt;
  if (frameTime <= 0) frameTime = 1000 / 30; //30 fps
  else return;
  
  updateController(dt);

  switch(gameState) {
    case 'START':
      mainUpdate(dt);
      break;
    case 'OVER':
      break;
    case 'MAIN':
      mainUpdate(dt);
      break;
  }
  
}

let p1Score = 0;
let p2Score = 0;
function scoreGoal(pid) {
  switch (pid) {
    case 1:
      p2Score += 1;
      break;
    case 2:
      p1Score += 1;
      break;
    default: break;
  }

  if (p2Score > 4 || p1Score > 4) {
    doGameOver();
  }

  document.querySelector('#score').classList.remove('score-fade');

  setTimeout(() => {
    document.querySelector('#score').classList.add('score-fade');
  }, 500);
}

function doGameOver() {
  console.log('doGameOver');
}

function init() {
  canvas = document.querySelector('#game-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 480;

  initController();
  calibrateController();

  ball = new Ball(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
  p1 = new Paddle(100, 240, '#ff8888');
  p2 = new Paddle(500, 240, '#8888ff');

  document.addEventListener('mousedown', (e) => {
    if (gameState == 'START') {
      // document.body.requestFullscreen();
      gameState = 'MAIN';
    }

  })

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'a':
        p1.rotate(0.1);
        break;
      case 'd':
        p1.rotate(-0.1)
        break;
      case 'w':
        p1.launch();
        break;
      case 'q':
        // shakeScreen(5, 1000);
        break;
      default: break;
    }
  })
  requestAnimationFrame(update);
}

window.onload = init;
