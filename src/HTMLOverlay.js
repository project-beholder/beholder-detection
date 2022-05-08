// Beholder HTML
export default (config, styles) => `
<div id="beholder-overlay" class="active">
  <style type="text/css">
  ${styles}
  </style>

  <div id="toggle-screen">
  ☰
  </div>

  <div id="detection-panel" ${config.overlay_params.hide ? 'class="hidden"' : ''}>
    
    <div id="full-video-div">
      <video id="beholder-video" playsinline="true"></video>
      <canvas id="detection-canvas-overlay"></canvas>
    </div>
    
    <div id="area-buttons">
      <button id="set-area" class="parameter-item">Set Detection Area</button>
      <div id="set-area-instructions"></div>
      <button id="clear-area" class="parameter-item">Clear Detection Area</button>
    </div>
    
    <div id="detection-video-div">
      <canvas id="detection-canvas"></canvas>
      <canvas id="debug-canvas"></canvas>
    </div>

    <div id="parameters-menu" >
      <div class="parameter-item">
        <span>Camera Feed ID</span>
        <select name="CAMERA_INDEX" id="camera_param_id" class="param-input">
          <option value="0" label="0" selected></option>
        </select>
      </div>

      <div class="parameter-item">
        <span>Video Size</span>
        <select name="VIDEO_SIZE_INDEX" id="camera_param_videoSize" class="param-input">
          <option value="0" label="320&times;240" ${config.camera_params.videoSize == 0 ? 'selected' : ''}></option>
          <option value="1" label="640&times;480" ${config.camera_params.videoSize == 1 ? 'selected' : ''}></option>
          <option value="2" label="1280&times;720" ${config.camera_params.videoSize == 2 ? 'selected' : ''}></option>
          <option value="2" label="1920&times;1080" ${config.camera_params.videoSize == 3 ? 'selected' : ''}></option>
        </select>
      </div>

      <div class="parameter-item">
        <span>Min Marker Distance</span>
        <input
          id="detection_params-minMarkerDistance"
          class="param-input"
          type="number"
          name="MIN_MARKER_DISTANCE"
          min="1"
          max="50"
          value="${config.detection_params.minMarkerDistance}"
          step="1"
        />
      </div>

      <div class="parameter-item">
        <span>Min Marker Perimeter</span>
        <input
          id="detection_params-minMarkerPerimeter"
          class="param-input"
          type="number"
          name="MIN_MARKER_PERIMETER"
          min="0.01"
          max="0.99"
          value="${config.detection_params.minMarkerPerimeter}"
          step="0.01"
        />
      </div>
      <div class="parameter-item">
        <span>Max Marker Perimeter</span>
        <input
          id="detection_params-maxMarkerPerimeter"
          class="param-input"
          type="number"
          name="MAX_MARKER_PERIMETER"
          min="0.01"
          max="4.00"
          value="${config.detection_params.maxMarkerPerimeter}"
          step="0.01"
        />
      </div>

      <div class="parameter-item">
        <span>Size After Perspective Removal</span>
        <input
          id="detection_params-sizeAfterPerspectiveRemoval"
          class="param-input"
          type="number"
          name="SIZE_AFTER_PERSPECTIVE_REMOVAL"
          min="1"
          max="200"
          value="${config.detection_params.sizeAfterPerspectiveRemoval}"
          step="1"
        />
      </div>

      <div class="parameter-item">
        <span>Contrast</span>
        <input
          id="detection_params-contrast"
          class="param-input"
          type="number"
          name="IMAGE_CONTRAST"
          min="-100"
          max="100"
          value="${config.feed_params.contrast}"
          step="1"
        />
      </div>

      <div class="parameter-item">
        <span>Brightness</span>
        <input
          id="detection_params-brightness"
          class="param-input"
          type="number"
          name="IMAGE_BRIGHTNESS"
          min="-100"
          max="100"
          value="${config.feed_params.brightness}"
          step="1"
        />
      </div>

      <div class="parameter-item">
        <span>Grayscale</span>
        <input
          id="detection_params-grayscale"
          class="param-input"
          type="number"
          name="IMAGE_GRAYSCALE"
          min="0"
          max="100"
          value="${config.feed_params.grayscale}"
          step="1"
        />
      </div>

      <div class="parameter-item">
        <span>Torch</span>
        <input
          id="detection_params-torch"
          class="param-input isCheck"
          type="checkbox"
          name="torch"
          ${config.camera_params.torch ? 'checked' : ''}
        />
      </div>

      <div class="parameter-item">
        <span>Mirror Camera</span>
        <input
          id="detection_params-flip"
          class="param-input isCheck"
          type="checkbox"
          name="Mirror"
          ${config.feed_params.flip ? 'checked' : ''}
        />
      </div>
    </div>
  </div>
</div>`;
