import * as R from 'ramda';
import sampleCombine from 'xstream/extra/sampleCombine'
import xs from "xstream";
import aruco from './aruco/index.js';

// DETECTION PARAMS SIDE EFFECTS HERE
// DO NOT NEED CANVAS
let detectionParams = {
  CAMERA_INFO: {},
  VIDEO_SIZE: { width: { exact: 640 }, height: { exact: 480 } },
  minMarkerDistance: 10,
  minMarkerPerimeter: 0.02,
  maxMarkerPerimeter: 0.8,
  sizeAfterPerspectiveRemoval: 49,
};

function DetectionManager(sources) {
  const canvas$ = sources.DOM.select('#detection-canvas').element();
  const ctx$ = canvas$.map((c) => c.getContext('2d'));
  const video$ = sources.DOM.select('#beholder-video').element();
  const dt$ = sources.update;

  const detector = new aruco.Detector();
  sources.config.subscribe({
    next: (c) => {
      detectionParams = {
        ...detectionParams,
        ...c.detection_params, // incoming params, should only replace marker size stuff
      };
    }
  });

  const marker$ = xs.combine(canvas$, ctx$, dt$, video$)
    .compose(sampleCombine(sources.config)) // we don't want to trigger detection when filters change
    .map(([drawVars, { feed_params }]) => {
      const [canvas, ctx, dt, v] = drawVars;

      if (v.readyState === v.HAVE_ENOUGH_DATA) {
        if (v.clientWidth > 20 && canvas.width !== v.clientWidth) {
          canvas.width = v.clientWidth;
          canvas.height = v.clientHeight;
        }
        // apply filter here
        ctx.filter = `contrast(${(100 + Math.floor(feed_params.contrast)) / 100})
         brightness(${(100 + Math.floor(feed_params.brightness)) / 100})
         grayscale(${Math.floor(feed_params.grayscale) / 100})`;

        if (feed_params.flip) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          // Render video frame
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          // Render video frame
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        }
    
        let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        let m = [detector.detect(imageData, detectionParams), dt,canvas.width,canvas.height];
        return m;
      } else {
        return [[], dt,canvas.width,canvas.height];
      }
    });

  return {
    marker$,
  }
}

export default DetectionManager;
