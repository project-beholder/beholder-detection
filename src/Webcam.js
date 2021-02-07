import xs from 'xstream';
import { video } from '@cycle/dom';

const VIDEO_SIZES = [
  { width: 320, height: 240 },
  { width: 640, height: 480 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 }
];

let vStream;
function startCameraFeed([videoSizeIndex, camID]) {
  const videoSize = VIDEO_SIZES[videoSizeIndex];

  if (vStream)
    vStream.getTracks().forEach(track => {
    track.stop();
  });

  // I don't really understand this part but it needs to be done every time
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

  const video$ = xs.of(video('#beholder-video', { attrs: { autoplay: true }, style: { display: 'none' } }));

  // Attach the video element to the source stream, must be done as a side effect
  xs.combine(sources.DOM.select('#beholder-video').element(), videoSrc$)
    .subscribe({
      next: ([v, s]) => {
        if ("srcObject" in v) {
          v.srcObject = s;
        } else {
          v.src = window.URL.createObjectURL(s);
        }

        vStream = s;
      },
      error: e => console.log(e)
    })
  
  return {
    vdom$: video$,
  }
}

export default Webcam;