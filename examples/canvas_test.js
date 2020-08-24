import Beholder from '../src/index';

let canvas, ctx;

function onLoad(){
  Beholder.init(); // optional params?

  canvas = document.querySelector('#example-canvas');
  canvas.width = 480;
  canvas.height = 360;
  ctx = canvas.getContext('2d');

  requestAnimationFrame(update);
}

let prevTime = Date.now();

function update() {
  const currentTime = Date.now();
  const dt = currentTime - prevTime;
  prevTime = currentTime;
  Beholder.update(dt / 1000);
  
  ctx.clearRect(0,0, 480, 360);
  
  Beholder.getMarkers().forEach(m => {
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
