import Beholder from '../src/index';

function onLoad(){

  // Initialize beholder
  Beholder.init(); // optional params?

  requestAnimationFrame(update);
}

let prevTime = Date.now();

function update() {
  const currentTime = Date.now();
  const delta = currentTime - prevTime;
  prevTime = currentTime;
  const dt = delta / 1000;

  Beholder.update();

  requestAnimationFrame(update);
}

window.onload = onLoad;
