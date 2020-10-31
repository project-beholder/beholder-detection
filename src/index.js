import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver, div, canvas } from '@cycle/dom';
import {
  toggleStyle, overlayStyle, detectionPanelStyle, detectionCanvasStyle, detectionCanvasOverlayStyle
} from './Styles';

import Webcam from './Webcam';
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

// Create marker 
for (let i = 0; i < MARKER_COUNT; i++) {
  MARKERS.push(new Marker(i));
}

// This has side effects to the MARKERS array so users can access it
const updateMarkers = ([markerChange, ocanvas, octx]) => {
  const [markers, dt] = markerChange;
  octx.clearRect(0, 0, ocanvas.width, ocanvas.height);

  markers.forEach(m => {
    if (m.id < MARKERS.length) {
      MARKERS[m.id].update(m);
    }

    const center = m.center;
    const corners = m.corners;
    const angle = MARKERS[m.id].rotation;
  
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

  const showOverlay$ = sources.DOM.select('#toggle-screen')
    .events('click')
    .fold((prev) => !prev, true);

  // Children
  const paramsMenu = ParamsMenu(sources);
  

  const camID$ = paramsMenu.paramChange$.filter((p) => p[0] === 'CAMERA_INDEX').map((p) => p[1]).startWith(0);
  const videoSize$ = paramsMenu.paramChange$.filter((p) => p[0] === 'VIDEO_SIZE_INDEX').map((p) => p[1]).startWith(1);
  const canvasDom$ = videoSize$.map((s) => {
    const size = VIDEO_SIZES[s];

    return div([
      canvas('#detection-canvas', { style: detectionCanvasStyle, attrs: { ...size } }),
      canvas('#detection-canvas-overlay', { style: detectionCanvasOverlayStyle, attrs: { ...size } }),
    ]);
  });

  const webcam = Webcam(sources, { videoSize$, camID$ });
  const detection = DetectionManager(sources, { paramChange$: paramsMenu.paramChange$ });
  const state$ = xs.combine(toggleHover$, showOverlay$);
  const children$ = xs.combine(canvasDom$, paramsMenu.vdom$, webcam.vdom$);

  const vdom$ = xs.combine(state$, children$)
    .map(([[toggleHover, showOverlay], children]) => {
      return div('#beholder-overlay', { style: overlayStyle }, [
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

// Should this have options here?
export const init = (domRoot) => {
  const drivers = {
    DOM: makeDOMDriver(domRoot),
    update: updateDriver,
  };

  run(main, drivers);
}

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

export default {
  init,
  update,
  getMarker,
  getMarkerPair,
  getAllMarkers,
}
