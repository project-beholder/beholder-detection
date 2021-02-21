import Vec2 from './utils/Vec2';

const MARKER_TIMEOUT_DEFAULT = 1000 / 20; 

class Marker {
  constructor(ID) {
    this.timeout = MARKER_TIMEOUT_DEFAULT;
    this.timestamp = this.timeout;
    this.present = false;
    this.center = new Vec2(0,0);
    this.corners = [];
    this.rotation = 0;
    this.scale = 29 / 640; // Default based on my markers and camera default of 640
    this.enable3D = false;
    this.avgPerim = 0;
    this.id = ID;
  }

  setScale(markerSize, cameraWidth) {
    this.scale = markerSize / cameraWidth;
  }

  update(m) {
    this.timestamp = 0;
    this.present = true;
    this.center.x = m.center.x;
    this.center.y = m.center.y;
    this.corners = m.corners.map(c => c);
    this.rotation = Vec2.angleBetween(
      Vec2.sub(this.corners[0], this.corners[1]),
      new Vec2(1, 0)
    );
    const sides = this.corners.map((c, i, arr) => {
      const dx = c.x - arr[(i + 1) % arr.length].x;
      const dy = c.y - arr[(i + 1) % arr.length].y;
      return Math.sqrt(dx * dx + dy * dy);
    });

    this.avgPerim = (sides[0] + sides[1] + sides[2] + sides[3]) / 4;

    if (this.enable3D) {
      this.center.z = this.avgPerim / this.scale;
    }
  }

  updatePresence(dt) {
    this.timestamp += dt;
    this.present = (this.timestamp >= this.timeout) ? false : true;
  }
}

export default Marker;
