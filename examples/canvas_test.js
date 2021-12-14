import Beholder from '../src/index';

let canvas, ctx;

function onLoad(){
  Beholder.init('#beholder-root', {
    camera_params: {
      videoSize: 1,
      torch: false,
      rearCamera: true,
    },
    detection_params: {
      minMarkerDistance: 10,
      minMarkerPerimeter: 0.02,
      maxMarkerPerimeter: 0.8,
      sizeAfterPerspectiveRemoval: 49,
    },
    feed_params: {
      contrast: 0,
      brightness: 0,
      grayscale: 0,
      flip: false,
    },
    overlay_params: {
      present: true, // if false, will set the overlay to not have any visible elements, but it will still exist in the html for detection
      hide: true, // sets the overlay to hide on the left of the screen with a button on top
    },
  }); // optional params?

  canvas = document.querySelector('#example-canvas');
  canvas.width = 640;
  canvas.height = 480;
  ctx = canvas.getContext('2d');
  Beholder.getMarker(4).positionSmoothing = 0.4;
  Beholder.getMarker(4).rotationSmoothing = 0.4;

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

  // console.log(Beholder.getMarker(4).deltaRotation);
  requestAnimationFrame(update);
}

window.onload = onLoad;
