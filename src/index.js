import * as PIXI from 'pixi.js';
import aruco from './aruco/index.js';
import GreyscaleImage from './aruco/GreyscaleImage';
import { greyscaleFilter, adaptiveThresholdFilter } from './ShaderFilters';

let video, imageData, detector, beholderContainer, pixiContainer, debugGraphics;
let pixiApp;
let canDetect = false;

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
    width: 960,         // 2x video settings
    height: 720,        // 2x video settings
    antialias: false,    // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    view: pixiContainer,
  });

  var texture = PIXI.Texture.from(video);
  var texture2 = PIXI.Texture.from(video);
  var videoSprite = new PIXI.Sprite(texture);
  var greyVideoSprite = new PIXI.Sprite(texture2);
  videoSprite.width = 480;
  videoSprite.height = 360;
  greyVideoSprite.width = 480;
  greyVideoSprite.height = 360;
  
  videoSprite.filters = [greyscaleFilter, adaptiveThresholdFilter];
  greyVideoSprite.filters = [greyscaleFilter];

  //sprite to canvas
  pixiApp.stage.addChild(videoSprite);
  videoSprite.position.x = 480;
  pixiApp.stage.addChild(greyVideoSprite);
  debugGraphics = new PIXI.Graphics();
  debugGraphics.position.y = 360;
  pixiApp.stage.addChild(debugGraphics);
  
  navigator.mediaDevices
    .getUserMedia({ video: { width: 480, height: 360, facingMode: "environment" } })
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

const FRAME_CAP = 1.0 / 35; // Capped frame rate, 1/30 = 30fps, make this something in options?
let frameCounter = 0;
let greyFormatImage = new GreyscaleImage(480, 360);
let greyFormatSourceImage = new GreyscaleImage(480, 360);

// Delta time expected as fraction of second (binding these for some reason?)
export const update = (dt) => {
  frameCounter += dt;

  // logic for frame capping for future optimizations
  // browsers are already capped at 60
  if (frameCounter >= FRAME_CAP && canDetect) {
    // fpsCounter.innerHTML = Math.floor(1 / frameCounter); <- ADD FRAME COUNTER TO OVERLAY
    frameCounter = 0;
  } else {
    return;
  }

  imageData = pixiApp.renderer.extract.pixels(pixiApp.stage);
  greyFormatImage.sampleFrom(imageData, 480*2, 480, 0);
  greyFormatSourceImage.sampleFrom(imageData, 480*2, 0, 0);

  var markers = detector.detect(greyFormatImage, greyFormatSourceImage);
  debugGraphics.clear(); // Maybe change name here

  // Draw candidates
  markers.forEach((m) => {
    const c = m.corners;
    debugGraphics.lineStyle(1, 0xffffff);

    debugGraphics.moveTo(c[0].x, c[0].y);
    debugGraphics.lineTo(c[1].x, c[1].y);
    debugGraphics.lineTo(c[2].x, c[2].y);
    debugGraphics.lineTo(c[3].x, c[3].y);
    debugGraphics.lineTo(c[0].x, c[0].y);
    
    debugGraphics.endFill();

  });
}

export default {
  init,
  update,
}
