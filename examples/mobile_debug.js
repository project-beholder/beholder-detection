import Beholder from '../src/index';

let canvas, ctx;

function onLoad(){
  document.body.addEventListener('click', () => {
    document.body.requestFullscreen();
  });

  Beholder.init('#beholder-root', {
    camera_params: {
      videoSize: 1,
      torch: false,
      rearCamera: true,
      area: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
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

  const v = Beholder.getVideo();

  // const areaWidth = detectionParams.area.end.x - detectionParams.area.start.x;
  // const areaHeight = detectionParams.area.end.y - detectionParams.area.start.y;
  const areaWidth = 1;
  const areaHeight = 1;

  if (v.width > 20 && canvas.width !== v.width * areaWidth) {
    // base it off of the actual area
    canvas.width = v.width * areaWidth;
    canvas.height = v.height * areaHeight;
  }
  
  
  // canvas.width = v.width;
  // canvas.height = v.height;
  ctx.drawImage(v,
    0, 0,
    canvas.width, canvas.height,
    0, 0,
    canvas.width, canvas.height);

  // ctx.drawImage(v,
  //   detectionParams.area.start.x * v.width,
  //   detectionParams.area.start.y * v.height,
  //   this.canvas.width, this.canvas.height,
  //   0, 0,
  //   this.canvas.width, this.canvas.height);
  
  Beholder.getAllMarkers().forEach(m => {
    if (!m.present) return;

    const center = m.center;
    const corners = m.corners;
    const angle = m.rotation;
  
    ctx.strokeStyle = "#FF00AA";
    ctx.lineWidth = 5;
    ctx.beginPath();
  
    corners.forEach((c, i) => {
      ctx.moveTo(c.x, c.y);
      let c2 = corners[(i + 1) % corners.length];
      ctx.lineTo(c2.x, c2.y);
    });
  
    ctx.stroke();
    ctx.closePath();
  
    // draw first corner
    ctx.strokeStyle = "blue";
    ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  
    ctx.strokeStyle = "#FF00AA";
    ctx.strokeRect(center.x - 1, center.y - 1, 2, 2);

    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FF55AA";
    ctx.fillText(`ID=${m.id}`, center.x, center.y - 7);
    ctx.fillText(angle.toFixed(2), center.x, center.y + 15);
});

  requestAnimationFrame(update);
}

window.onload = onLoad;
