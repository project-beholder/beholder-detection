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

  const detector = new aruco.Detector();
  props.paramChange$
    .filter(([pname]) => (pname !== 'VIDEO_SIZE_INDEX' && pname !== 'CAMERA_INDEX'))
    .subscribe({
      next: ([param, value]) => {
        detectionParams[param] = parseFloat(value);
      },
    });

  const marker$ = xs.combine(canvas$, ctx$, dt$, video$)
    .map(([canvas, ctx, dt, v]) => {
      if (v.readyState === v.HAVE_ENOUGH_DATA) {
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
