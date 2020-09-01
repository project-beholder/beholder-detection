import * as PIXI from 'pixi.js';
import aruco from './aruco/index.js';
import GreyscaleImage from './aruco/GreyscaleImage';
import { greyscaleFilter, adaptiveThresholdFilter } from './ShaderFilters';

import Marker from './Marker';
import MarkerPair from './MarkerPair';

let video, imageData, detector, beholderContainer, pixiContainer, debugGraphics;
let pixiApp;
let canDetect = false;
const width = 640;
const height = 480;
let videoSprite, greyVideoSprite

const MARKER_COUNT = 100;
const MARKERS = [];

// Create marker 
for (let i = 0; i < MARKER_COUNT; i++) {
  MARKERS.push(new Marker(i));
}

// Should this have options here?
export const init = () => {
  beholderContainer = document.createElement('div');
  beholderContainer.id = 'beholder-container';
  beholderContainer.style = `
    position: absolute;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 10;
    display: none;
  `; // DOCUMENT THESE STYLES
  document.body.appendChild(beholderContainer);

  video = document.createElement('video');
  video.autoplay = 'true';
  video.style = 'display:none;';
  beholderContainer.appendChild(video);

  pixiContainer = document.createElement('canvas');
  pixiContainer.id = 'pixi-container';
  pixiContainer.style = `
    position: absolute;
    left: 0;
    top: 0;
  `;
  beholderContainer.appendChild(pixiContainer);

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  pixiApp = new PIXI.Application({  
    width: width * 2,         // 2x video settings
    height: height,        // 2x video settings
    antialias: false,    // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    view: pixiContainer,
    autoStart: false,
  });

  var texture = PIXI.Texture.from(video);
  var texture2 = PIXI.Texture.from(video);
  videoSprite = new PIXI.Sprite(texture);
  greyVideoSprite = new PIXI.Sprite(texture2);
  videoSprite.width = width;
  videoSprite.height = height;
  greyVideoSprite.width = width;
  greyVideoSprite.height = height;
  
  videoSprite.filters = [greyscaleFilter, adaptiveThresholdFilter];
  greyVideoSprite.filters = [greyscaleFilter];

  //sprite to canvas
  pixiApp.stage.addChild(videoSprite);
  videoSprite.position.x = width;
  pixiApp.stage.addChild(greyVideoSprite);
  debugGraphics = new PIXI.Graphics();
  pixiApp.stage.addChild(debugGraphics);
  
  navigator.mediaDevices
    .getUserMedia({ video: { width: width, height: height, facingMode: "environment" } })
    .then(function(stream) {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }

      detector = new aruco.Detector();
      canDetect = true;
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }
  );
}

let canShow = false;
let shown = false;
export const show = () => {
  shown = true;
  beholderContainer.style = `
    position: absolute;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 10;
    display: block;
  `
}

export const hide = () => {
  shown = false;
  beholderContainer.style = `
    position: absolute;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 10;
    display: none;
  `
}

let greyFormatImage = new GreyscaleImage(width, height);
let greyFormatSourceImage = new GreyscaleImage(width, height);

export const getAllMarkers = () => {
  return MARKERS;
}

export const getMarker = (id) => {
  // Maybe let this error?
  if (id > MARKERS.length) {
    return undefined;
  }
  return MARKERS[id];
}

export const getMarkerPair = (idA, idB) => {
  // throw error here
  new MarkerPair(MARKERS[idA], MARKERS[idB]);
}

const detect = () => {
  pixiApp.render();

  imageData = pixiApp.renderer.plugins.extract.pixels(pixiApp.stage);
  greyFormatImage.sampleFrom(imageData, width*2, width, 0);
  greyFormatSourceImage.sampleFrom(imageData, width*2, 0, 0);

  return detector.detect(greyFormatImage, greyFormatSourceImage);
}

const updateMarkers = (dt, detectedMarkers) => {
  detectedMarkers.forEach(m => {
    if (m.id < MARKERS.length) {
      MARKERS[m.id].update(m);
    }
  })

  MARKERS.forEach(m => m.updatePresence(dt));
}

let prevTime = Date.now();
export const update = () => {
  if (!canDetect) return;
  const currentTime = Date.now();
  const dt = (currentTime - prevTime) / 1000;
  prevTime = currentTime;

  updateMarkers(dt, detect());

  // Draw detected markers here
  if (shown) {
    debugGraphics.clear();
    // Draw candidates
    MARKERS.forEach((m) => {
      // Bail of marker isn't present
      if (!m.present) return;

      debugGraphics.endFill();

      const center = m.center;
      const corners = m.corners;
      const angle = m.rotation;

      debugGraphics.lineStyle(3, 0xff00aa);
      debugGraphics.moveTo(corners[0].x, corners[0].y);
      debugGraphics.lineTo(corners[1].x, corners[1].y);
      debugGraphics.lineTo(corners[2].x, corners[2].y);
      debugGraphics.lineTo(corners[3].x, corners[3].y);
      debugGraphics.lineTo(corners[0].x, corners[0].y);

      // draw center
      debugGraphics.drawRect(center.x - 1, center.y - 1, 2, 2);

      // draw first corner
      debugGraphics.lineStyle(3, 0x0000aa);
      debugGraphics.drawRect(corners[0].x - 2, corners[0].y - 2, 4, 4);

      // dctx.font = "12px monospace";
      // dctx.textAlign = "center";
      // dctx.fillStyle = "#FF55AA";
      // dctx.fillText(`ID=${m.id}`, center.x, center.y - 7);
      // dctx.fillText(angle.toFixed(2), center.x, center.y + 15);
    });
  }
}

export default {
  init,
  update,
  getMarker,
  getAllMarkers,
  show,
  hide,
}
