import * as R from 'ramda';
import sampleCombine from 'xstream/extra/sampleCombine'
import xs from "xstream";
import aruco from './aruco/index.js';

// DETECTION PARAMS SIDE EFFECTS HERE
// DO NOT NEED CANVAS
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

function DetectionManager(sources, props) {
  const canvas$ = sources.DOM.select('#detection-canvas').element();
  const ctx$ = canvas$.map((c) => c.getContext('2d'));
  const video$ = sources.DOM.select('#beholder-video').element();
  const dt$ = sources.update;

  const contrast$ = sources.DOM.select('#IMAGE_CONTRAST').events('change')
    .map((e) => e.target.value)
    .startWith(0)
    .map(v => (100 + Math.floor(v)) / 100)
    .map(v => `contrast(${v})`);

  const brightness$ = sources.DOM.select('#IMAGE_BRIGHTNESS').events('change')
    .map((e) => e.target.value)
    .startWith(0)
    .map(v => (100 + Math.floor(v)) / 100)
    .map(v => `brightness(${v})`);

  const grayscale$ = sources.DOM.select('#IMAGE_GRAYSCALE').events('change')
    .map((e) => e.target.value)
    .startWith(0)
    .map(v => Math.floor(v) / 100)
    .map(v => `grayscale(${v})`);
  
  const filter$ = xs.combine(contrast$, brightness$, grayscale$).map(R.join(' '));

  const detector = new aruco.Detector();
  props.paramChange$
    .filter(([pname]) => (pname !== 'VIDEO_SIZE_INDEX' && pname !== 'CAMERA_INDEX'))
    .subscribe({
      next: ([param, value]) => {
        detectionParams[param] = parseFloat(value);
      },
    });

  const marker$ = xs.combine(canvas$, ctx$, dt$, video$)
    .compose(sampleCombine(filter$)) // we don't want to trigger detection when filters change
    .map(([drawVars, filters]) => {
      const [canvas, ctx, dt, v] = drawVars;

      if (v.readyState === v.HAVE_ENOUGH_DATA) {
        // apply filter here
        ctx.filter = filters;
        // Render video frame
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    
        let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        return [detector.detect(imageData, detectionParams), dt];
      } else {
        return [[], dt];
      }
    });

  return {
    marker$,
  }
}

export default DetectionManager;
