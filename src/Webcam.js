const VIDEO_SIZES = [
  { width: 320, height: 240 },
  { width: 640, height: 360 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 }
];


class WebcamManager {
  constructor(video) {
    this.video = video;
    this.vStream = null;
    
    // set up camera feeds
    const cameraSelect = document.querySelector('#camera_param_id');
    cameraSelect.innerHTML = "";
    navigator.mediaDevices.enumerateDevices()
      .then((feeds) => {
        feeds.forEach((f, i) => {
          if (f.kind === "videoinput") {
            const opt = document.createElement("option");
            opt.value = f.deviceId;
            opt.label = f.label ? f.label : i;
            if (i === 0) opt.selected = true;
            cameraSelect.appendChild(opt);
          }
        });
      });

  }

  startCameraFeed({ videoSize: videoSizeIndex, camID, rearCamera, torch }) {
    const videoSize = VIDEO_SIZES[videoSizeIndex];
    
    if (this.vStream) {
        this.vStream.getTracks().forEach(track => {
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

    // I guess we are returning the whole promise.
    return navigator.mediaDevices
      .getUserMedia({
        video: {
          width: videoSize.width,
          height: videoSize.height,
          deviceId: (camID !== 0 && !rearCamera) ? { exact: camID } : {},
          facingMode: rearCamera ? { exact: 'environment' } : {},
        }
      }).then((s) => {
        if ("srcObject" in this.video) {
          this.video.srcObject = s;
        } else {
          this.video.src = window.URL.createObjectURL(s);
        }
        // For if we ever need to figure out the actual size of the thing we are using
        // console.log(s.getVideoTracks()[0].getSettings().height, s.getVideoTracks()[0].getSettings().width);
      
        this.video.width = s.getVideoTracks()[0].getSettings().width;
        this.video.height = s.getVideoTracks()[0].getSettings().height;
        this.video.play();
        this.vStream = s;
        console.log('BEHOLDER: new video stream established')

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
            console.warn('**BEHOLDER WARNING** Flahslight/Torch functionality is not supported on this device or platform')
          }
        }
      }); // PROBABLY NEED ERROR HANDLING HERE
  }
}

export default WebcamManager;
