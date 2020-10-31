import Beholder from '../src/index';

let canvas, ctx;

function onLoad(){
  Beholder.init('#beholder-root'); // optional params?

  canvas = document.querySelector('#example-canvas');
  canvas.width = 640;
  canvas.height = 480;
  ctx = canvas.getContext('2d');

  requestAnimationFrame(update);
}

let prevTime = Date.now();

function update() {
  const currentTime = Date.now();
  const dt = currentTime - prevTime;
  prevTime = currentTime;
  Beholder.update();
  
  ctx.clearRect(0,0, 640, 480);
  
  Beholder.getAllMarkers().forEach(m => {
    if (!m.present) return;
    const c = m.corners;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';

    ctx.beginPath();
    ctx.moveTo(c[0].x, c[0].y);
    ctx.lineTo(c[1].x, c[1].y);
    ctx.lineTo(c[2].x, c[2].y);
    ctx.lineTo(c[3].x, c[3].y);
    ctx.lineTo(c[0].x, c[0].y);
    
    ctx.stroke();
});

  requestAnimationFrame(update);
}

window.onload = onLoad;
