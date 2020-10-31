import aruco from './aruco/index.js';
import GreyscaleImage from './aruco/GreyscaleImage';

import Marker from './Marker';
import MarkerPair from './MarkerPair';
import { initUI } from './ParamsMenu';

let video, imageData, detector, canvas, ctx, canvasOverlay, ctxOverlay;
let canDetect = false;
let width = 640;
let height = 480;
const detectionParams = {
  CAMERA_INFO: {},
  VIDEO_SIZE: { width: { exact: 640 }, height: { exact: 480 } },
  MIN_MARKER_DISTANCE: 10,
  MIN_MARKER_PERIMETER: 0.02,
  MAX_MARKER_PERIMETER: 0.8,
  SIZE_AFTER_PERSPECTIVE_REMOVAL: 49,
  IMAGE_CONTRAST: 0,
  IMAGE_BRIGHTNESS: 0,
  IMAGE_GRAYSCALE: 0
};

const MARKER_COUNT = 100;
const MARKERS = [];

// Create marker 
for (let i = 0; i < MARKER_COUNT; i++) {
  MARKERS.push(new Marker(i));
}

// Should this have options here? // // initialize detection stuff and hack in to detection loop Beholder.init("#detection-canvas", "#detection-canvas-overlay");
export const init = () => {
  canvas = document.querySelector('#detection-canvas');
  ctx = canvas.getContext('2d');
  canvasOverlay = document.querySelector('#detection-canvas-overlay');
  ctxOverlay = canvasOverlay.getContext('2d');

  video = document.createElement('video');
  video.id = 'beholder-video';
  video.autoplay = 'true';
  video.style = `display: none;`;

  document.body.appendChild(video);
  initUI();
  startCameraFeed();
}

let canShow = false;
let shown = false;

export const getAllMarkers = () => {
  return MARKERS;
}

export const setCamera = (camID) => {
  detectionParams.CAMERA_INFO.exact = camID;
  startCameraFeed();
}


export const setVideoSize = (val) => {
  detectionParams.VIDEO_SIZE = VIDEO_SIZE_OPTIONS[val];
  startCameraFeed();
};

export const getCameraFeeds = () => {
  return navigator.mediaDevices.enumerateDevices();
};

let videoStream;
export const startCameraFeed = () => {
  if (videoStream) videoStream.getTracks().forEach(track => track.stop());

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: detectionParams.VIDEO_SIZE.width,
        height: detectionParams.VIDEO_SIZE.height,
        deviceId: detectionParams.CAMERA_INFO
      }
    })
    .then(stream => {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }

      videoStream = stream;
      detector = new aruco.Detector();
      canDetect = true;
    })
    .catch(err => {
      console.log(err.name + ": " + err.message);
    });
};

export const getVideoStream = () => {
  return videoStream;
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

export default {
  init,
  update,
  getMarker,
  getAllMarkers,
  getCameraFeeds,
  setCamera,
  setVideoSize,
}
