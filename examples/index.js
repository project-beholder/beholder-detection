import Beholder from '../src/index';

let m1, m2;
function onLoad(){
  // Initialize beholder
  Beholder.init('#beholder-root', { camera_params: { videoSize: 0 }, overlay_params: { present: true } }); 
  m1 = Beholder.getMarker(11);
  m2 = Beholder.getMarker(0);

  requestAnimationFrame(update);
}

let hidden = false;
// document.addEventListener('mousedown', () => {
//   if (hidden) {
//     Beholder.show();
//     hidden = false;
//   } else {
//     Beholder.hide();
//     hidden = true;
//   }
// })

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
