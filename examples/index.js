import Beholder from '../src/index';

let m1, m2;
function onLoad(){
  // Initialize beholder
  Beholder.init('#beholder-root'); 
  m1 = Beholder.getMarker(11);
  m2 = Beholder.getMarker(0);
  requestAnimationFrame(update);
}

let prevTime = Date.now();

function update() {
  const currentTime = Date.now();
  const delta = currentTime - prevTime;
  prevTime = currentTime;
  const dt = delta / 1000;

  Beholder.update();
  console.log(m1.present)
  requestAnimationFrame(update);
}

window.onload = onLoad;
