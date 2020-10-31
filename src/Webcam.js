import xs from 'xstream';
import { video } from '@cycle/dom';

const VIDEO_SIZES = [
  { width: 320, height: 240 },
  { width: 640, height: 480 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 }
];
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

function startCameraFeed([videoSizeIndex, camID]) {
  const videoSize = VIDEO_SIZES[videoSizeIndex];
  // wtf is this part
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      return new Promise(function(res, rej) {
        getUserMedia.call(navigator, constraints, res, rej);
      });
    };
  }
  // if (videoStream) videoStream.getTracks().forEach(track => track.stop());
  return navigator.mediaDevices
    .getUserMedia({
      video: {
        width: videoSize.width,
        height: videoSize.height,
        deviceId: camID !== 0 ? { exact: camID } : {},
      }
    });
};

function Webcam(sources, props) {
  const videoSrc$ = xs.combine(props.videoSize$, props.camID$)
    .map((vs) => xs.fromPromise(startCameraFeed(vs)))
    .flatten();
  // const video$ = videoSrc$.map((srcStream) => {
  //   return video('#beholder-video', { attrs: { autoplay: true, srcObject: srcStream }, style: { display: 'none' } })
  // });
  const video$ = xs.of(video('#beholder-video', { attrs: { autoplay: true }, style: { display: 'none' } }));

  // fix it
  xs.combine(sources.DOM.select('#beholder-video').element(), videoSrc$)
    .subscribe({
      next: ([v, s]) => {
        if ("srcObject" in v) {
          v.srcObject = s;
        } else {
          v.src = window.URL.createObjectURL(s);
        }
      }
    })
  
  return {
    vdom$: video$,
  }
}

export default Webcam;