import Vec2 from './utils/Vec2.js';

const MARKER_TIMEOUT_DEFAULT = 1000 / 20; 
const AXIS_VEC = new Vec2(1, 0);

class Marker {
  constructor(ID) {
    this.timeout = MARKER_TIMEOUT_DEFAULT;
    this.timestamp = this.timeout;
    this.present = false;
    this.center = new Vec2(0,0);
    this.position = new Vec2(0,0);
    this.rawPosition = new Vec2(0,0);
    this.deltaPosition = new Vec2(0, 0);
    this.corners = [];
    this.rawRotation = 0;
    this.rotation = 0;
    this.deltaRotation = 0;
    this.scale = 29 / 640; // Default based on my markers and camera default of 640
    this.enable3D = false;
    this.avgSideLength = 0;
    this.deltaAvgSideLength = 0;
    this.id = ID;

    this.positionSmoothing = 0; // Percent of previous position carried over into the new one, must be btw 0 and 1
    this.rotationSmoothing = 0; // Percent of previous rotation carried over into the new one, must be btw 0 and 1
  }

  setScale(markerSize, cameraWidth) {
    this.scale = markerSize / cameraWidth;
  }

  update(m) {
    this.timestamp = 0;
    this.present = true;
    this.deltaPosition.copy(this.position);
    // console.log(this.position.x);
    let prevCenter = this.center.clone();

    this.center.x = (this.center.x * this.positionSmoothing) + (m.center.x * (1-this.positionSmoothing));
    this.center.y = (this.center.y * this.positionSmoothing) + (m.center.y * (1-this.positionSmoothing));
    this.position.copy(this.center);
    this.rawPosition.copy(m.center);

    this.deltaPosition.sub(this.position).scale(-1); // bc we changed center this should be cool now

    // For some reason it broke. This will just fix it real quick
    if (isNaN(this.center.x) || isNaN(this.center.y)) {
      this.center.set(prevCenter.x, prevCenter.y);
      this.position.set(prevCenter.x, prevCenter.y);
      this.deltaPosition.set(0, 0);
      this.rawP
      console.warn('BEHOLDER: Detection Broke Momentarily');
    }

    // WASTED MEMORY
    this.corners = m.corners.map(c => c); // wtf, seems like a lazy way to copy, but whatever

    // Rotation stuff, now with smoothing!
    this.rawRotation = AXIS_VEC.angleBetween(Vec2.sub(this.corners[0], this.corners[1]));
    const prevRotationVec = Vec2.fromAngle(this.rotation);
    const newRotationVec = Vec2.fromAngle(this.rawRotation);
    const smoothedRotationVec = new Vec2(
      (prevRotationVec.x * (this.rotationSmoothing)) + (newRotationVec.x * 1 - this.rotationSmoothing),
      (prevRotationVec.y * (this.rotationSmoothing)) + (newRotationVec.y * 1 - this.rotationSmoothing)
    );
    this.rotation = smoothedRotationVec.getAngle();

    this.deltaRotation = Vec2.angleBetween(prevRotationVec, smoothedRotationVec);
    
    // could save memory with regular for loop here, or maybe a reduce?
    const sides = this.corners.map((c, i, arr) => {
      const dx = c.x - arr[(i + 1) % arr.length].x;
      const dy = c.y - arr[(i + 1) % arr.length].y;
      return Math.sqrt(dx * dx + dy * dy);
    });

    this.deltaAvgSideLength = -this.avgSideLength;
    this.avgSideLength = (sides[0] + sides[1] + sides[2] + sides[3]) / 4;
    this.deltaAvgSideLength += this.avgSideLength;

    // TODO: what the heck is this?
    if (this.enable3D) {
      this.center.z = this.avgPerim / this.scale;
    }
  }

  updatePresence(dt) {
    // throttle max timeout to 50
    this.timestamp += dt > 30 ? 30 : dt;
    this.present = (this.timestamp >= this.timeout) ? false : true;
  }
}

export default Marker;
