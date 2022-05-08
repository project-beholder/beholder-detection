import WebcamManager from './Webcam.js';
import DetectionManager from './DetectionManager.js';
import Marker from './Marker.js';
import MarkerPair from './MarkerPair.js';
import CreateHTML from './HTMLOverlay.js';
import AllStyle from './BeholderStyles.css';

const defaultConfig = {
  camera_params: {
    camID: undefined,
    videoSize: 1,
    torch: false,
    rearCamera: false,
  },
  detection_params: {
    minMarkerDistance: 10,
    minMarkerPerimeter: 0.02,
    maxMarkerPerimeter: 0.8,
    sizeAfterPerspectiveRemoval: 49,
    area: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  },
  feed_params: {
    contrast: 0,
    brightness: 0,
    grayscale: 0,
    flip: false,
  },
  // TODO: These are not implemented atm, should default to hidden or no?
  overlay_params: {
    present: true, // if false, will set the overlay to not have any visible elements, but it will still exist in the html for detection
    hide: true, // sets the overlay to hide on the left of the screen with a button on top
  },
};

// some stuff for detection area
let isSettingDetectionArea = false;
let detectionAreaClicks = [];
let isPanelHidden = false;

const MARKER_COUNT = 100;
const MARKERS = [];

// pass this to html function
let config = {};

let webcamMan, detectionMan;
// This has side effects to the MARKERS array so users can access it
// which markers changed, overlay canvas, overlay ctx
let overlayCanvas, overlayCtx, videoElement, videoCanvas, videoCtx, debugCanvas, debugCtx;
const updateMarkers = (markerChange) => {
  const [markers, dt] = markerChange;
  if (videoCanvas.width !== videoElement.width) {
    videoCanvas.width = videoElement.width;
    videoCanvas.height = videoElement.height;
  }
  
  // only draw when panel visible
  if (!isPanelHidden) {
    videoCtx.drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height);

    // detection area!
    videoCtx.strokeStyle = "#00FF00";
    videoCtx.beginPath();
    videoCtx.moveTo(videoCanvas.width * config.detection_params.area.start.x, videoCanvas.height * config.detection_params.area.start.y)
    videoCtx.lineTo(videoCanvas.width * config.detection_params.area.end.x, videoCanvas.height * config.detection_params.area.start.y)
    videoCtx.lineTo(videoCanvas.width * config.detection_params.area.end.x, videoCanvas.height * config.detection_params.area.end.y)
    videoCtx.lineTo(videoCanvas.width * config.detection_params.area.start.x, videoCanvas.height * config.detection_params.area.end.y)
    videoCtx.closePath();
    videoCtx.stroke();
  }

  // const offsetX = config.detection_params.area.start.x * overlayCanvas.width;
  // const offsetY = config.detection_params.area.start.y * overlayCanvas.height;
  // overlayCtx.save();
  // overlayCtx.translate(offsetX, offsetY);
  
  debugCanvas.width = overlayCanvas.width;
  debugCanvas.height = overlayCanvas.height;
  
  if (!isPanelHidden) debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
  
  markers.forEach(detectedMarker => {
    const m = MARKERS.find((x) => x.id === detectedMarker.id);

    if (m === undefined) return;
    m.update(detectedMarker);

    // this is all draw code, bail if panel hidden
    if (isPanelHidden) return;

    const center = m.center;
    const corners = m.corners;
    const angle = m.rotation;
  
    debugCtx.strokeStyle = "#FF00AA";
    debugCtx.beginPath();
  
    corners.forEach((c, i) => {
      debugCtx.moveTo(c.x, c.y);
      let c2 = corners[(i + 1) % corners.length];
      debugCtx.lineTo(c2.x, c2.y);
    });
  
    debugCtx.stroke();
    debugCtx.closePath();
  
    // draw first corner
    debugCtx.strokeStyle = "blue";
    debugCtx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  
    debugCtx.strokeStyle = "#FF00AA";
    debugCtx.strokeRect(center.x - 1, center.y - 1, 2, 2);

    debugCtx.font = "12px monospace";
    debugCtx.textAlign = "center";
    debugCtx.fillStyle = "#FF55AA";
    debugCtx.fillText(`ID=${m.id}`, center.x, center.y - 7);
    debugCtx.fillText(angle.toFixed(2), center.x, center.y + 15);
  });
  // overlayCtx.restore();

  MARKERS.forEach(m => m.updatePresence(dt));
};

const init = (domRoot, userConfig, markerList) => {
  if (markerList) {
    if (markerList.length <= 0) console.warn('BEHOLDER WARNING: your provided list of markers is empty, no markers will be tracked');

    markerList.forEach(id => MARKERS.push(new Marker(id)));
  } else {
    for (let i = 0; i < MARKER_COUNT; i++) {
      MARKERS.push(new Marker(i));
    }
  }

  const root = document.querySelector(domRoot);

  // If it's undefined just intialize with an empty config
  config = defaultConfig;
  // Merge default and user config
  if (userConfig) {
    if (userConfig.camera_params) config.camera_params = { ...config.camera_params, ...userConfig.camera_params };
    if (userConfig.detection_params) config.detection_params = { ...config.detection_params, ...userConfig.detection_params };
    if (userConfig.feed_params) config.feed_params = { ...config.feed_params, ...userConfig.feed_params };
    if (userConfig.overlay_params) config.overlay_params = { ...config.overlay_params, ...userConfig.overlay_params };
  }

  root.innerHTML = CreateHTML(config, AllStyle);
  videoElement = root.querySelector('#beholder-video');
  videoElement.setAttribute("playsinline", "playsinline"); // IOS HACK HERE
  
  document.querySelector('#set-area-instructions').innerHTML = `
          start=x:${config.detection_params.area.start.x.toFixed(2)},y:${config.detection_params.area.start.y.toFixed(2)}&nbsp;&nbsp;&nbsp;
          end=x:${config.detection_params.area.end.x.toFixed(2)},y:${config.detection_params.area.end.y.toFixed(2)}
          `;
  
  // Set up all of the dom events
  root.querySelector('#toggle-screen').addEventListener('click', () => {
    if (isPanelHidden) root.querySelector('#detection-panel').classList.remove('hidden');
    else root.querySelector('#detection-panel').classList.add('hidden');
    isPanelHidden = !isPanelHidden;
  });
  
  isPanelHidden = config.overlay_params.hide;
  if (isPanelHidden) root.querySelector('#detection-panel').classList.add('hidden');
  
  
  // set detection area code
  root.querySelector('#set-area').addEventListener('click', () => {
    isSettingDetectionArea = true;
    detectionAreaClicks = [];
    document.querySelector('#set-area-instructions').innerHTML = `Select top-left corner.`;
  });
  root.querySelector('#detection-canvas-overlay').addEventListener('click', (e) => {
    if (isSettingDetectionArea) {
      detectionAreaClicks.push({
        x: e.offsetX / e.target.clientWidth,
        y: e.offsetY / e.target.clientHeight,
      });

      // NEED TO SOLVE FOR EDGE CASE WHERE THE 2ND POINT IS ABOVE/BEHIND THE 1ST
      if (detectionAreaClicks.length > 1) {
        isSettingDetectionArea = false;

        config.detection_params.area = {
          start: {
            x: Math.min(detectionAreaClicks[0].x, detectionAreaClicks[1].x),
            y: Math.min(detectionAreaClicks[0].y, detectionAreaClicks[1].y),
          },
          end: {
            x: Math.max(detectionAreaClicks[0].x, detectionAreaClicks[1].x),
            y: Math.max(detectionAreaClicks[0].y, detectionAreaClicks[1].y),
          }
        };
        
        document.querySelector('#set-area-instructions').innerHTML = `
          start=x:${config.detection_params.area.start.x.toFixed(2)},y:${config.detection_params.area.start.y.toFixed(2)}&nbsp;&nbsp;&nbsp;
          end=x:${config.detection_params.area.end.x.toFixed(2)},y:${config.detection_params.area.end.y.toFixed(2)}
          `;
        
      } else if (detectionAreaClicks.length === 1) {
        document.querySelector('#set-area-instructions').innerHTML = `Select bottom-right corner.`;
      }
    }
  });
  
  // reset detection area
  root.querySelector('#clear-area').addEventListener('click', () => {
    config.detection_params.area = {
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    };
    
    document.querySelector('#set-area-instructions').innerHTML = `
          start=x:${config.detection_params.area.start.x.toFixed(2)},y:${config.detection_params.area.start.y.toFixed(2)}&nbsp;&nbsp;&nbsp;
          end=x:${config.detection_params.area.end.x.toFixed(2)},y:${config.detection_params.area.end.y.toFixed(2)}
          `;
  })

  // camera stream change events
  root.querySelector('#camera_param_id').addEventListener('change', (e) => {
    config.camera_params.camID = e.target.value;

    // re-attach camera stream
    webcamMan.startCameraFeed(config.camera_params);
  });

  root.querySelector('#camera_param_videoSize').addEventListener('change', (e) => {
    config.camera_params.videoSize = e.target.value;

    // re-attach camera stream
    webcamMan.startCameraFeed(config.camera_params);
  });

  root.querySelector('#detection_params-minMarkerDistance')
    .addEventListener('change', (e) => config.detection_params.minMarkerDistance = e.target.value);
  root.querySelector('#detection_params-minMarkerPerimeter')
    .addEventListener('change', (e) => config.detection_params.minMarkerPerimeter = e.target.value);
  root.querySelector('#detection_params-maxMarkerPerimeter')
    .addEventListener('change', (e) => config.detection_params.maxMarkerPerimeter = e.target.value);
  root.querySelector('#detection_params-sizeAfterPerspectiveRemoval')
    .addEventListener('change', (e) => config.detection_params.sizeAfterPerspectiveRemoval = e.target.value);
  
  root.querySelector('#detection_params-contrast')
    .addEventListener('change', (e) => config.feed_params.contrast = e.target.value);
  root.querySelector('#detection_params-brightness')
    .addEventListener('change', (e) => config.feed_params.brightness = e.target.value);
  root.querySelector('#detection_params-grayscale')
    .addEventListener('change', (e) => config.feed_params.grayscale = e.target.value);
  root.querySelector('#detection_params-flip')
    .addEventListener('change', (e) => config.feed_params.flip = e.target.checked);
  
  root.querySelector('#detection_params-torch')
    .addEventListener('change', (e) => {
      config.camera_params.torch = e.target.checked;

      webcamMan.startCameraFeed(config.camera_params);
    });

  // set up service managers
  webcamMan = new WebcamManager(root.querySelector('#beholder-video'));
  detectionMan = new DetectionManager(root.querySelector('#detection-canvas'), root.querySelector('#beholder-video'));
  
  videoCanvas = root.querySelector('#detection-canvas-overlay');
  videoCtx = videoCanvas.getContext('2d');
  
  overlayCanvas = root.querySelector('#detection-canvas');
  overlayCtx = overlayCanvas.getContext('2d');
  
  debugCanvas = root.querySelector('#debug-canvas');
  debugCtx = debugCanvas.getContext('2d');

  // fix camera on resize
  window.addEventListener('resize', () => webcamMan.startCameraFeed(config.camera_params));

  webcamMan.startCameraFeed(config.camera_params);
  return;
}

let prevTime = Date.now();
export const update = () => {
  const currentTime = Date.now();
  const dt = currentTime - prevTime;
  prevTime = currentTime;

  // check to see that we do indeed have video?

  // run detection
  if (webcamMan.videoLoaded) {
    const detectedMarkers = detectionMan.detect(dt, config.feed_params, config.detection_params)
    // update and draw markers
    updateMarkers(detectedMarkers);
  }
};

const hide = () => {
  document.querySelector('#detection-panel').classList.add('hidden');
};
const show = () => {
  document.querySelector('#detection-panel').classList.remove('hidden');
};

export const getAllMarkers = () => {
  return MARKERS;
}

export const getMarker = (id) => {
  // Maybe have this error if you are looking for an untracked marker
  return MARKERS.find((x) => x.id === id);
}

export const getMarkerPair = (idA, idB) => {
  // throw error here
  return new MarkerPair(MARKERS[idA], MARKERS[idB]);
}

export default {
  init,
  update,
  getMarker,
  getMarkerPair,
  getAllMarkers,
  hide,
  show,
  getVideo: () => (webcamMan.video),
}
