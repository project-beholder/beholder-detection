import xs from 'xstream';
import { video } from '@cycle/dom';

const VIDEO_SIZES = [
  { width: 320, height: 240 },
  { width: 640, height: 480 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 }
];

let vStream;
const vStreamListeners = [];
export const addVideoStreamListener = (listener) => {
  vStreamListeners.push(listener);
}

function startCameraFeed([videoSizeIndex, camID, isRear]) {
  const videoSize = VIDEO_SIZES[videoSizeIndex];

  if (vStream) {
      vStream.getTracks().forEach(track => {
      track.stop();
    });
  }

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
        deviceId: (camID !== 0 && !isRear) ? { exact: camID } : {},
        facingMode: isRear ? { exact: 'environment' } : {},
      }
    });
};

function Webcam(sources, props) {
  const rear$ = sources.config
    .map((c) => c.camera_params.rearCamera)
    .take(2); // This is a hack to ignore default config just in case an ignore all config updates later
    // but it since it's only set on startup it should be fine.

  const videoSrc$ = xs.combine(props.videoSize$, props.camID$, rear$)
    .map((vs) => xs.fromPromise(startCameraFeed(vs)))
    .flatten();

  const video$ = xs.of(video('#beholder-video', { attrs: { autoplay: true, playsinline: true } }));

  // Attach the video element to the source stream, must be done as a side effect
  xs.combine(sources.DOM.select('#beholder-video').element(), videoSrc$, props.torch$)
    .subscribe({
      next: ([v, s, torch]) => {
        if ("srcObject" in v) {
          v.srcObject = s;
        } else {
          v.src = window.URL.createObjectURL(s);
        }
        v.play();
        vStream = s;

        // Call all listeners to pass them the v stream
        vStreamListeners.forEach(l => l(vStream));

        if (torch) {
          if (ImageCapture) {
            // Clements turn on the flashlight code, feels hacky
            const track = s.getVideoTracks()[0];
            //Create image capture object and get camera capabilities
            const imageCapture = new ImageCapture(track);

            const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {
              //todo: check if camera has a torch
              if (track.getCapabilities().torch !== undefined) {
                track.applyConstraints({
                  advanced: [{ torch }]
                });
              }
            });
          } else {
            console.warn('BEHOLDER WARNS: Flahslight/Torch functionality is not supported on this device or platform')
          }
        }
      },
      error: e => console.log(e)
    })
  
  return {
    vdom$: video$,
  }
}

export default Webcam;