import Beholder from '../src/index';

let fps;

function onLoad(){
  fps = document.querySelector('#fps');
  console.log(fps);
  Beholder.init(); // optional params?
  Beholder.show(); // Puts it on screen, should also enable marker drawing

  requestAnimationFrame(update);
}

let prevTime = Date.now();

function update() {
  const currentTime = Date.now();
  const delta = currentTime - prevTime;
  prevTime = currentTime;
  const dt = delta / 1000;
  fps.innerHTML = Math.floor(1 / dt);
  Beholder.update(dt);

  requestAnimationFrame(update);
}

window.onload = onLoad;
