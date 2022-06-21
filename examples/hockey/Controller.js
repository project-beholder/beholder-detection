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


let config = {
  camera_params: {
    videoSize: 1, // The video size values map to the following [320 x 240, 640 x 480, 1280 x 720, 1920 x 1080]
    rearCamera: false, // Boolean value for defaulting to the rear facing camera. Only works on mobile
    torch: false, // Boolean value for if torch/flashlight is on. Only works for rear facing mobile cameras. Can only be set from init
  },
  detection_params: {
    minMarkerDistance: 2,
    minMarkerPerimeter: 0.01,
    maxMarkerPerimeter: 1,
    sizeAfterPerspectiveRemoval: 49,
    area: {
      start: { x: 0.35, y: 0.20 },
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

// TODO
// Add overlay
// Build ctrlr
// Add 

let updateTimer = 30; // cap updates
function updateController(deltaTime) {
  // if (updateTimer < 0) {
    Beholder.update();
    // updateTimer = 20;
  // }
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
          p1Offset.copy(p1Marker.center.x);
        }
        if (p1Marker.avgSideLength > 17.8) p1.launch();

        scoreDiv.innerHTML = p1Marker.center.y;
        const p1MarkerOffset = new Vec2(p1Marker.center.x, p1Marker.center.y)
          .sub(p1Offset)
          .scale(1/20 * deltaTime / 5);
          // .normalize();
        scoreDiv.innerHTML = p1MarkerOffset.mag();
        if (p1MarkerOffset.mag() > 0.2) p1.moveBy(p1MarkerOffset);
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
          .sub(p2Offset)
          .scale(1/20 * deltaTime / 5);
          // .normalize();
        scoreDiv.innerHTML = p2MarkerOffset.mag();
        if (p2MarkerOffset.mag() > 0.2) p2.moveBy(p2MarkerOffset);
      } else {
        p2Marker.center.x = 0;
        p2Marker.center.y = 0;
      }
    }
    
  return;
}

function initController() {
  Beholder.init('#beholder-root', config);
  calibrateController();
  scoreDiv = document.querySelector('#score')

  p1Marker = Beholder.getMarker(0);
  p2Marker = Beholder.getMarker(1);
  refMarker = Beholder.getMarker(0);

  p1Marker.rotationSmoothing = 0.5;
  p2Marker.rotationSmoothing = 0.5;
  refMarker.rotationSmoothing = 0.5;

  // p1Marker.timeout = 200;
  // p2Marker.timeout = 200;
}
