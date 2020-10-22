import Beholder from './index';

let appMode = false;
// This should inject the UI and attach listeners
export function initUI() {
  // Detection param field changes
  document.querySelector("#MIN_MARKER_DISTANCE")
    .addEventListener("change", e => Beholder.setParam("MIN_MARKER_DISTANCE", e.target.value));
  
  document.querySelector("#MIN_MARKER_PERIMETER")
    .addEventListener("change", e => Beholder.setParam("MIN_MARKER_PERIMETER", e.target.value));

  document.querySelector("#MAX_MARKER_PERIMETER")
    .addEventListener("change", e => Beholder.setParam("MAX_MARKER_PERIMETER", e.target.value));
  
  document.querySelector("#SIZE_AFTER_PERSPECTIVE_REMOVAL")
    .addEventListener("change", e => Beholder.setParam("SIZE_AFTER_PERSPECTIVE_REMOVAL", e.target.value));
  
  document.querySelector("#IMAGE_BRIGHTNESS")
    .addEventListener("change", e => {
      Beholder.setParam("IMAGE_BRIGHTNESS", e.target.value);
      Beholder.filterImage();
    });
  
  document.querySelector("#IMAGE_CONTRAST")
    .addEventListener("change", e => {
      Beholder.setParam("IMAGE_CONTRAST", e.target.value);
      Beholder.filterImage();
    });
  
  document.querySelector("#IMAGE_GRAYSCALE")
    .addEventListener("change", e => {
      Beholder.setParam("IMAGE_GRAYSCALE", e.target.value);
      Beholder.filterImage();
    });

  const cameraSelect = document.querySelector("#CAMERA_INDEX");
  Beholder.getCameraFeeds().then(feeds => {
    cameraSelect.innerHTML = "";

    feeds.forEach((f, i) => {
      if (f.kind === "videoinput") {
        const opt = document.createElement("option");
        opt.value = f.deviceId;
        opt.label = f.label ? f.label : i;
        if (i === 0) opt.selected = true;
        cameraSelect.appendChild(opt);
      }
    });

    cameraSelect.addEventListener("change", e => {
      // console.log(e.target.value);
      Beholder.setCamera(e.target.value);
    });
  });

  document.querySelector("#VIDEO_SIZE_INDEX").addEventListener("change", e => {
    console.log(e.target.value);
    Beholder.setVideoSize(e.target.value);
  });

  document.querySelector("#toggleScreen").addEventListener("click", e => {
    appMode = !appMode;
    document.querySelector("#toggleScreen").classList.toggle("active");
    document.querySelector("#detectionDiv").classList.toggle("active");
  });
};