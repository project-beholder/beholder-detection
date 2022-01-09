import aruco from './aruco/index.js';

class DetectionManager {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.video = video;
    this.detector = new aruco.Detector();
  }

  detect(dt, feedParams, detectionParams) {
    if (this.video && this.video.readyState === 4) {
      const areaWidth = detectionParams.area.end.x - detectionParams.area.start.x;
      const areaHeight = detectionParams.area.end.y - detectionParams.area.start.y;
      if (this.video.width > 20 && this.canvas.width !== this.video.width * areaWidth) {
        // base it off of the actual area
        this.canvas.width = this.video.width * areaWidth;
        this.canvas.height = this.video.height * areaHeight;
      }

      // apply filter here
      this.ctx.filter = `contrast(${(100 + Math.floor(feedParams.contrast)) / 100})
      brightness(${(100 + Math.floor(feedParams.brightness)) / 100})
      grayscale(${Math.floor(feedParams.grayscale) / 100})`;

      if (feedParams.flip) {
        this.ctx.save();
        this.ctx.translate(this.canvas.width, 0);
        this.ctx.scale(-1, 1);
        // Render video frame
        // this is where we draw sub image stuff
        this.ctx.drawImage(this.video,
                           detectionParams.area.start.x * this.video.width,
                           detectionParams.area.start.y * this.video.height,
                           this.canvas.width, this.canvas.height,
                           0, 0,
                           this.canvas.width, this.canvas.height);
        this.ctx.restore();
      } else {
        // Render video frame
        // this is where we draw sub image stuff
        this.ctx.drawImage(this.video,
                           detectionParams.area.start.x * this.video.width,
                           detectionParams.area.start.y * this.video.height,
                           this.canvas.width, this.canvas.height,
                           0, 0,
                           this.canvas.width, this.canvas.height);
      }
  
      // i think this uses dx and dy :()
      let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      let m = [this.detector.detect(imageData, detectionParams), dt, this.canvas.width, this.canvas.height];
      return m;
    } else {
      return [[], dt, this.canvas.width, this.canvas.height];
    }
  }   
}

export default DetectionManager;
