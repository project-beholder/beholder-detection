import Beholder from '../src/index';
  
function onLoad(){
  Beholder.init(); // optional params?
  // Beholder.show(); // Puts it on screen, should also enable marker drawing

  requestAnimationFrame(update);
}

let prevTime = Date.now();

function update() {
  const currentTime = Date.now();
  const dt = currentTime - prevTime;
  prevTime = currentTime;
  Beholder.update(dt / 1000);

  requestAnimationFrame(update);
}

window.onload = onLoad;
