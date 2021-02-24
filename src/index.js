import xs from 'xstream';
import pairwise from 'xstream/extra/pairwise'
import { run } from '@cycle/run';
import { makeDOMDriver, div, canvas } from '@cycle/dom';
import {
  toggleStyle, noOverlayStyle, overlayStyle, detectionPanelStyle, detectionCanvasStyle, detectionCanvasOverlayStyle
} from './Styles';

import Webcam, { addVideoStreamListener } from './Webcam';
import DetectionManager from './DetectionManager';
import Marker from './Marker';
import MarkerPair from './MarkerPair';
import ParamsMenu from './ParamsMenu';

const VIDEO_SIZES = [
  { width: 320, height: 240 },
  { width: 640, height: 480 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 }
];

const MARKER_COUNT = 100;
const MARKERS = [];

// This has side effects to the MARKERS array so users can access it
const updateMarkers = ([markerChange, ocanvas, octx]) => {
  const [markers, dt] = markerChange;
  octx.clearRect(0, 0, ocanvas.width, ocanvas.height);

  markers.forEach(detectedMarker => {
    const m = MARKERS.find((x) => x.id === detectedMarker.id);

    if (m === undefined) return;
    m.update(detectedMarker);

    const center = detectedMarker.center;
    const corners = detectedMarker.corners;
    const angle = m.rotation;
  
    octx.strokeStyle = "#FF00AA";
    octx.beginPath();
  
    corners.forEach((c, i) => {
      octx.moveTo(c.x, c.y);
      let c2 = corners[(i + 1) % corners.length];
      octx.lineTo(c2.x, c2.y);
    });
  
    octx.stroke();
    octx.closePath();
  
    // draw first corner
    octx.strokeStyle = "blue";
    octx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  
    octx.strokeStyle = "#FF00AA";
    octx.strokeRect(center.x - 1, center.y - 1, 2, 2);
  
    octx.font = "12px monospace";
    octx.textAlign = "center";
    octx.fillStyle = "#FF55AA";
    octx.fillText(`ID=${m.id}`, center.x, center.y - 7);
    octx.fillText(angle.toFixed(2), center.x, center.y + 15);
  });

  MARKERS.forEach(m => m.updatePresence(dt));
};

function main(sources) {
  const toggleHover$ = xs.merge(
    sources.DOM.select('#toggle-screen').events('mouseover').mapTo(true),
    sources.DOM.select('#toggle-screen').events('mouseout').mapTo(false)
  ).startWith(false);

  const toggleOverlay$ = sources.DOM.select('#toggle-screen')
    .events('click')
    .mapTo((s) => {
      s.overlay_params.hide = !s.overlay_params.hide;
      return s;
    });

  const hideOverlay$ = sources.config
    .map(c => c.overlay_params.hide);
  
  const isPresent$ = sources.config
    .map(c => c.overlay_params.present);

  // Children
  const paramsMenu = ParamsMenu(sources);

  const camID$ = paramsMenu.camID$;

  // this makes it so it doesn't trigger every time the config updates but only on this field changing
  const videoSize$ = sources.config.map(c => c.camera_params.videoSize)
    .startWith(-1)
    .compose(pairwise)
    .filter(([a, b]) => a !== b)
    .map(([a, b]) => b)
    .startWith(0);

  const torch$ = sources.config.map(c => c.camera_params.torch)
    .startWith(false)
    .compose(pairwise)
    .filter(([a, b]) => a !== b)
    .map(([a, b]) => b)
    .startWith(false);

  const canvasDom$ = videoSize$.map((s) => {
    const size = VIDEO_SIZES[s];

    return div([
      canvas('#detection-canvas', { style: detectionCanvasStyle, attrs: { ...size } }),
      canvas('#detection-canvas-overlay', { style: detectionCanvasOverlayStyle, attrs: { ...size } }),
    ]);
  });

  const webcam = Webcam(sources, { videoSize$, camID$, torch$ });
  const detection = DetectionManager(sources);
  const state$ = xs.combine(isPresent$, hideOverlay$);
  const children$ = xs.combine(canvasDom$, paramsMenu.vdom$, webcam.vdom$);

  const vdom$ = xs.combine(state$, children$)
    .map(([[isPresent, showOverlay], children]) => {
      return div('#beholder-overlay', { style: isPresent ? overlayStyle : noOverlayStyle }, [
        div('#toggle-screen', { style:toggleStyle.main }, `⥂`),
        div('#detection-panel', { style: showOverlay ? detectionPanelStyle.main : detectionPanelStyle.active }, children),
      ]);
    });

  // Detection and draw stuff
  const ocanvas$ = sources.DOM.select('#detection-canvas-overlay').element();
  const octx$ = ocanvas$.map((c) => c.getContext('2d'));

  xs.combine(detection.marker$, ocanvas$, octx$).subscribe({
    next: updateMarkers,
  });

  // Init detection backend
  // have updates from the DOM driver init side effects
  // not sure if the canvas ref should change but we should be able to do it with a select
  // expose update
  const sinks = {
    DOM: vdom$,
    config: xs.merge(paramsMenu.configUpdate$, toggleOverlay$),
  };
  return sinks;
}

// this is some sloppy stuff here all to forward stuff into a stream
let hiddenUpdate;
let prevTime = Date.now();
const updateDriver = (/* no sinks */) => {
  return xs.create({
    start: (listener) => {
      hiddenUpdate = () => {
        const currentTime = Date.now();
        const dt = currentTime - prevTime;
        prevTime = currentTime;
        listener.next(dt);
      }
    },
    stop: () => {},
  });
}
export const update = () => { hiddenUpdate(); };
// end sloppy update stuff

// Begin sloppy show/hide stuff
function hideOverlay(config) {
  config.overlay_params.hide = true;
  return config;
}

function showOverlay(config) {
  config.overlay_params.hide = false;
  return config;
}

const hideShow$ = xs.create();
const hide = () => {
  hideShow$.shamefullySendNext(hideOverlay);
};
const show = () => {
  hideShow$.shamefullySendNext(showOverlay);
};
// End show/hide stuff

// This is basically a reducer
function makeConfigDiver(startConfig) {
  return (sink$) => {
    // return sink$.startWith(startConfig);
    return xs.merge(xs.of((s) => s), sink$, hideShow$)
      .fold((state, mod) => mod(state), startConfig);
  };
}

const defaultConfig = {
  camera_params: {
    videoSize: 1,
    torch: false,
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
}

// Should this have options here?
export const init = (domRoot, userConfig, markerList) => {
  if (markerList) {
    if (markerList.length <= 0) console.warn('BEHOLDER WARNING: your provided list of markers is empty, no markers will be tracked');

    markerList.forEach(id => MARKERS.push(new Marker(id)));
  } else {
    for (let i = 0; i < MARKER_COUNT; i++) {
      MARKERS.push(new Marker(i));
    }
  }

  // If it's undefined just intialize with an empty config
  let config = defaultConfig;
  // Ramda could help us here
  if (userConfig) {
    if (userConfig.camera_params) config.camera_params = { ...config.camera_params, ...userConfig.camera_params };
    if (userConfig.detection_params) config.detection_params = { ...config.detection_params, ...userConfig.detection_params };
    if (userConfig.feed_params) config.feed_params = { ...config.feed_params, ...userConfig.feed_params };
    if (userConfig.overlay_params) config.overlay_params = { ...config.overlay_params, ...userConfig.overlay_params };
  }

  const drivers = {
    DOM: makeDOMDriver(domRoot),
    update: updateDriver,
    config: makeConfigDiver(config),
  };

  run(main, drivers);
}

export const getAllMarkers = () => {
  return MARKERS;
}

export const getMarker = (id) => {
  // Maybe have this error if you are looking for an untracked marker
  return MARKERS.find((x) => x.id === id);
}

export const getMarkerPair = (idA, idB) => {
  // throw error here
  new MarkerPair(MARKERS[idA], MARKERS[idB]);
}

export default {
  init,
  update,
  getMarker,
  getMarkerPair,
  getAllMarkers,
  hide,
  show,
  addVideoStreamListener,
}
