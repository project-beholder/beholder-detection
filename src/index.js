import * as PIXI from 'pixi.js';
import aruco from './aruco/index.js';
import GreyscaleImage from './aruco/GreyscaleImage';
import { greyscaleFilter, adaptiveThresholdFilter } from './ShaderFilters';

let video, imageData, detector, beholderContainer, pixiContainer, debugGraphics;
let pixiApp;
let canDetect = false;
const width = 640;
const height = 480;
let videoSprite, greyVideoSprite

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

let markers = [];
export const getMarkers = () => {
  return markers;
}

export const getMarker = (id) => {
  return markers.find(m => m.id === id);
}

// Delta time expected as fraction of second (binding these for some reason?)
export const update = (dt) => {
  if (!canDetect) return;
  pixiApp.render();

  imageData = pixiApp.renderer.plugins.extract.pixels(pixiApp.stage);
  greyFormatImage.sampleFrom(imageData, width*2, width, 0);
  greyFormatSourceImage.sampleFrom(imageData, width*2, 0, 0);

  markers = detector.detect(greyFormatImage, greyFormatSourceImage);

  if (shown) {
    debugGraphics.clear();
    // Draw candidates
    markers.forEach((m) => {
      const c = m.corners;
      debugGraphics.lineStyle(2, 0x4444ff);

      debugGraphics.moveTo(c[0].x, c[0].y);
      debugGraphics.lineTo(c[1].x, c[1].y);
      debugGraphics.lineTo(c[2].x, c[2].y);
      debugGraphics.lineTo(c[3].x, c[3].y);
      debugGraphics.lineTo(c[0].x, c[0].y);
      
      debugGraphics.endFill();
    });
  }
}

export default {
  init,
  update,
  getMarker,
  getMarkers,
  show,
  hide,
}
