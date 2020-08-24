import * as PIXI from 'pixi.js';
import aruco from './aruco/index.js';
import AR from './aruco/index.js';
import GreyscaleImage from './aruco/GreyscaleImage';
import { greyscaleFilter, adaptiveThresholdFilter } from './ShaderFilters';

let canStreamMarkers = false;

const MESSAGE_TYPES = {
  SET_HOST: 'SET_HOST',
  MARKER_DATA: 'MARKER_DATA',
  VIDEO_DATA: 'VIDEO_DATA',
  SET_CAMERA_PARAMS: 'SET_CAMERA_PARAMS',
  CONNECT_TO_HOST: 'CONNECT_TO_HOST',
};

let peerID;
let shouldStreamVideo = false;
let canStream = false;
const params = (new URL(document.location)).searchParams;
let fpsCounter;

var video, imageData, detector;
var overlay, overlayCtx;
var debugGraphics;
let app;
  
function onLoad(){
  video = document.getElementById("video");
  overlay = document.getElementById("pixi-overlay");

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

  app = new PIXI.Application({  
    width: 960,         // default: 800
    height: 720,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    view: document.querySelector('#pixi-overlay')
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
  app.stage.addChild(videoSprite);
  videoSprite.position.x = 480;
  app.stage.addChild(greyVideoSprite);
  debugGraphics = new PIXI.Graphics();
  debugGraphics.position.y = 360;
  app.stage.addChild(debugGraphics);
  
  navigator.mediaDevices
    .getUserMedia({ video: { width: 480, height: 360, facingMode: "environment" } })
    .then(function(stream) {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }
  );

  detector = new aruco.Detector();
  requestAnimationFrame(update);
}

let prevTime = Date.now();
const FRAME_CAP = 1.0 / 35; // Capped frame rate, 1/30 = 30fps
let frameCounter = 0;
let greyFormatImage = new GreyscaleImage(480, 360);
let greyFormatSourceImage = new GreyscaleImage(480, 360);

function update() {
  const currentTime = Date.now();
  const dt = currentTime - prevTime;
  prevTime = currentTime;
  frameCounter += dt / 1000;
  requestAnimationFrame(update);

  // logic for frame capping for future optimizations
  // browsers are already capped at 60
  if (frameCounter >= FRAME_CAP) {
    // fpsCounter.innerHTML = Math.floor(1 / frameCounter);
    frameCounter = 0;
  } else {
    return;
  }

  // if (video.readyState === video.HAVE_ENOUGH_DATA){
    // // Render video frame
    imageData = app.renderer.extract.pixels(app.stage);
    greyFormatImage.sampleFrom(imageData, 480*2, 480, 0);
    greyFormatSourceImage.sampleFrom(imageData, 480*2, 0, 0);

    var markers = detector.detect(greyFormatImage, greyFormatSourceImage);
    debugGraphics.clear();
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


function drawId(markers){
  var corners, corner, x, y, i, j;

  overlayCtx.strokeStyle = "blue";
  overlayCtx.lineWidth = 1;

  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;

    x = Infinity;
    y = Infinity;

    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];

      x = Math.min(x, corner.x);
      y = Math.min(y, corner.y);
    }

    overlayCtx.strokeText(markers[i].id, x, y)
  }
}

window.onload = onLoad;
