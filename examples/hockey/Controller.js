const Beholder = window['beholder-detection'].default;
console.log(Beholder);

let wasP1Present = false;
let establishedCenter = false;
let p1Center = new Vec2(0, 0);
let p1BaseSize = 0;
let wasP1PlungerHeld = false;
let p1Marker, p2Marker, refMarker;

let p1Offset = new Vec2(0, 0);
let p1AngleVec = new Vec2(0, 0);
let p2Offset = new Vec2(0, 0);
let p2AngleVec = new Vec2(0, 0);
let didP2Launch = false;
let refScale = 0;

let calibrationSamples = 0;
let calibrating = true;
let calibrationSamplesLeft = 20;
let controllerState = 'CALIBRATING';
let scoreDiv;

let overlayCanvas, overlayCtx;
let beholderConfig = {
  camera_params: {
    videoSize: 1, // The video size values map to the following [320 x 240, 640 x 480, 1280 x 720, 1920 x 1080]
    rearCamera: true, // Boolean value for defaulting to the rear facing camera. Only works on mobile
    torch: false, // Boolean value for if torch/flashlight is on. Only works for rear facing mobile cameras. Can only be set from init
  },
  detection_params: {
    minMarkerDistance: 2,
    minMarkerPerimeter: 0.01,
    maxMarkerPerimeter: 1,
    sizeAfterPerspectiveRemoval: 49,
    area: {
      start: { x: 0.25, y: 0.10 },
      end:   { x: 0.9, y: 0.65 },
    },
  },
  feed_params: {
    contrast: 0,
    brightness: 0,
    grayscale: 0,
    flip: false,
  },
  overlay_params: {
    present: true, // Determines if the Beholder overlay will display or be invisible entirely via display: none
    hide: true, // Determines if the overlay should be hidden on the left of the screen or visible
  },
};


function calibrateController() {
  p1Offset.set(0, 0);
  p2Offset.set(0, 0);

  calibrationSamplesLeft = 20;
  calibrating = true;
  controllerState = 'CALIBRATING';
}

function updateOverlay() {
  overlayCtx.clearRect(0,0, 640, 480);

  const v = Beholder.getVideo();

  // const areaWidth = detectionParams.area.end.x - detectionParams.area.start.x;
  // const areaHeight = detectionParams.area.end.y - detectionParams.area.start.y;
  const areaWidth = beholderConfig.detection_params.area.end.x - beholderConfig.detection_params.area.start.x;
  const areaHeight = beholderConfig.detection_params.area.end.y - beholderConfig.detection_params.area.start.y;

  if (v.width > 20 && overlayCanvas.width !== v.width * areaWidth) {
    // base it off of the actual area
    overlayCanvas.width = v.width * areaWidth;
    overlayCanvas.height = v.height * areaHeight;
  }
  
  overlayCtx.drawImage(v,
    beholderConfig.detection_params.area.start.x * v.width,
    beholderConfig.detection_params.area.start.y * v.height,
    overlayCanvas.width, overlayCanvas.height,
    0, 0,
    overlayCanvas.width, overlayCanvas.height);
  
  Beholder.getAllMarkers().forEach(m => {
    if (!m.present) return;
    if (m.corners.length === 0) return;

    const center = m.center;
    const corners = m.corners;
    const angle = m.rotation;
  
    overlayCtx.strokeStyle = "#FF00AA";
    overlayCtx.lineWidth = 5;
    overlayCtx.beginPath();
  
    corners.forEach((c, i) => {
      overlayCtx.moveTo(c.x, c.y);
      let c2 = corners[(i + 1) % corners.length];
      overlayCtx.lineTo(c2.x, c2.y);
    });
    overlayCtx.stroke();
    overlayCtx.closePath();
  
    // draw first corner
    overlayCtx.strokeStyle = "blue";
    overlayCtx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  
    overlayCtx.strokeStyle = "#FF00AA";
    overlayCtx.strokeRect(center.x - 1, center.y - 1, 2, 2);

    overlayCtx.font = "12px monospace";
    overlayCtx.textAlign = "center";
    overlayCtx.fillStyle = "#FF55AA";
    overlayCtx.fillText(`ID=${m.id}`, center.x, center.y - 7);
    overlayCtx.fillText(angle.toFixed(2), center.x, center.y + 15);
  });
}

// TODO
// Add overlay
// Build ctrlr

let updateTimer = 30; // cap updates
function updateController(deltaTime) {
  // if (updateTimer < 0) {
  Beholder.update();
    // updateTimer = 20;
  // }
  updateOverlay();
  updateTimer -= deltaTime;

  // do calibration step
  // hacked to wait for thing to load
  // probably need to redo this to account for drift :( and controller shifting
//   if (calibrating && p1Marker.present && p2Marker.present) {
//     p1Offset.add(Vec2.sub(p1Marker.center, refMarker.center))
//       .scale(calibrationScale);
//     p2Offset.add(Vec2.sub(p2Marker.center, refMarker.center))
//       .scale(calibrationScale);

//     calibrating = (calibrationSamples < 20);
//     calibrationSamples += 1;
//     calibrationScale = 0.5;

//     refScale = refMarker.corners
//       .map((c) => new Vec2(c.x, c.y))
//       .reduce((acc, c) => {
//         // console.log(c.sub(p2Marker.center).mag());
//         acc += c.sub(refMarker.center).mag();
//         return acc;
//       }, 0);
// } else {

    p1.rotate(p1Marker.deltaRotation / -1);
    p2.rotate(p2Marker.deltaRotation / -1);
    if (p1Marker.present) {
      if (p1Marker.center.x) {
        if (p1Marker.center.x > 0 && p1Offset.x === 0) {
          p1Offset.copy(p1Marker.center);
        }
        // console.log(p1Marker.avgSideLength);
        if (p1Marker.avgSideLength > 38.5) p1.launch();

        scoreDiv.innerHTML = p1Marker.center.y;
        const p1MarkerOffset = new Vec2(p1Marker.center.x, p1Marker.center.y)
          .sub(p1Offset)
          .scale(1/50 * deltaTime / 5);
          // .normalize();
        // scoreDiv.innerHTML = p1MarkerOffset.mag();
        // console.log(p1MarkerOffset.mag());
        p1MarkerOffset.x *= -1;
        if (p1MarkerOffset.mag() > 2) p1.moveBy(p1MarkerOffset);
      } else {
        p1Marker.center.x = 0;
        p1Marker.center.y = 0;
      }
    }

    if (p2Marker.present) {
      if (p2Marker.center.x) {
        if (p2Marker.center.x > 0 && p2Offset.x === 0) {
          p2Offset.copy(p2Marker.center.x);
        }

        if (p2Marker.avgSideLength > 17.8) p2.launch();

        scoreDiv.innerHTML = p2Marker.center.y;
        const p2MarkerOffset = new Vec2(p2Marker.center.x, p2Marker.center.y)
          .sub(p2Offset);
          // .normalize();
        scoreDiv.innerHTML = p2MarkerOffset.mag();
        if (p2MarkerOffset.mag() > 20) p2.moveBy(p2MarkerOffset.normalize().scale(deltaTime / 15));
      } else {
        p2Marker.center.x = 0;
        p2Marker.center.y = 0;
      }
    }
    
  return;
}

function initController() {
  Beholder.init('#beholder-root', beholderConfig);
  calibrateController();
  scoreDiv = document.querySelector('#score');

  // init overlay
  overlayCanvas = document.querySelector('#example-canvas');
  overlayCtx = overlayCanvas.getContext('2d');
  overlayCanvas.addEventListener('click', () => {
    overlayCanvas.classList.toggle('big-canvas');
  });

  p1Marker = Beholder.getMarker(0);
  p2Marker = Beholder.getMarker(1);
  refMarker = Beholder.getMarker(2);

  p1Marker.rotationSmoothing = 0.5;
  p2Marker.rotationSmoothing = 0.5;
  refMarker.rotationSmoothing = 0.5;

  // p1Marker.timeout = 200;
  // p2Marker.timeout = 200;
}
