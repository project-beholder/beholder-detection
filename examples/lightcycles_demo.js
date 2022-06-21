import { DocumentDOMSource } from '@cycle/dom/lib/cjs/DocumentDOMSource';
import Beholder from '../src/index';

let overlayCanvas, overlayCtx, gameCanvas, gameCtx;

const beholderConfig = {
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
    area: { start: { x: 0.15, y: 0.15 }, end: { x: 1, y: 0.55 } },
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
};

// TODO
/**
 * color choices
 */

// game vars
let playerDir = { x: 1, y: 0 };
let playerPos = { x: 300, y: 300 };
let trailOn = false;
let trail = [];
let upM, downM, leftM, rightM, trailM;
let wasUp = false;
let wasDown = false;
let wasLeft = false;
let wasRight = false;

function onLoad(){
  document.body.addEventListener('click', () => {
    // document.body.requestFullscreen();
  });

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'x':
        trailOn = !trailOn;
        if (trailOn) trail = [];
        break;
      case 'a':
        playerDir.x = -1;
        playerDir.y = 0;
        break;
      case 'w':
        playerDir.x = 0;
        playerDir.y = -1;
        break;
      case 's':
        playerDir.x = 0;
        playerDir.y = 1;
        break;
      case 'd':
        playerDir.x = 1;
        playerDir.y = 0;
        break;
    }
  })

  Beholder.init('#beholder-root', beholderConfig); // optional params?

  upM = Beholder.getMarker(7);
  downM = Beholder.getMarker(6);
  leftM = Beholder.getMarker(5);
  rightM = Beholder.getMarker(8);
  trailM = Beholder.getMarker(2);
  trailM.timeout = 200;

  overlayCanvas = document.querySelector('#example-canvas');
  overlayCtx = overlayCanvas.getContext('2d');

  overlayCanvas.addEventListener('click', () => {
    overlayCanvas.classList.toggle('big-canvas');
  })

  gameCanvas = document.querySelector('#game-canvas');
  gameCtx = gameCanvas.getContext('2d');

  requestAnimationFrame(update);
}

let prevTime = Date.now();

let frameTime = 0;
const FRAME_RATE = 1000 / 20;

function update() {
  const currentTime = Date.now();
  const dt = currentTime - prevTime;
  prevTime = currentTime;
  Beholder.update();
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

  if (frameTime <= 0) {
    if (leftM.present && !wasLeft) {
      playerDir.x = -1;
      playerDir.y = 0;
    }
    wasLeft = leftM.present;
    if (rightM.present && !wasRight) {
      playerDir.x = 1;
      playerDir.y = 0;
    }
    wasRight = rightM.present;
    if (upM.present && !wasUp) {
      playerDir.x = 0;
      playerDir.y = -1;
    }
    wasUp = upM.present;
    if (downM.present && !wasDown) {
      playerDir.x = 0;
      playerDir.y = 1;
    }
    wasDown = downM.present;
    if (!trailOn && trailM.present) trail = [];
    trailOn = trailM.present;

    // game update
    // - render trail
    // - reset trail
    if (trailOn) {
      trail.push({ x: playerPos.x, y: playerPos.y });
    }

    let speed = 4;
    let pSize = 20;
    playerPos.x += playerDir.x * speed;
    playerPos.y += playerDir.y * speed;

    if (playerPos.x < -pSize) playerPos.x = gameCanvas.width + pSize;
    if (playerPos.x > gameCanvas.width + pSize) playerPos.x = -pSize;
    if (playerPos.y < -pSize) playerPos.y = gameCanvas.height + pSize;
    if (playerPos.y > gameCanvas.height + pSize) playerPos.y = -pSize;

    // game draw
    gameCtx.fillStyle = '#111';
    gameCtx.fillRect(0,0, gameCanvas.width, gameCanvas.height);
    gameCtx.fillStyle = 'white';
    gameCtx.fillRect(playerPos.x - pSize / 2, playerPos.y - pSize / 2, pSize, pSize);

    if (trail.length > 1) {
      gameCtx.beginPath();
      gameCtx.lineWidth = 5;
      gameCtx.strokeStyle = 'white';
      gameCtx.moveTo(trail[0].x, trail[0].y);
      trail.forEach((node) => {
        gameCtx.lineTo(node.x, node.y);
      });
      gameCtx.stroke();
    }

    frameTime = FRAME_RATE;
  } else {
    frameTime -= dt;
  }

  requestAnimationFrame(update);
}

window.onload = onLoad;
