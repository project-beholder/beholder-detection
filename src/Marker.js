import Vec2 from './utils/Vec2';

const MARKER_TIMEOUT_DEFAULT = 1 / 20; 

class Marker {
  constructor(ID) {
    this.timeout = MARKER_TIMEOUT_DEFAULT;
    this.timestamp = this.timeout;
    this.present = false;
    this.center = { x: 0, y: 0 };
    this.corners = [];
    this.rotation = 0;

    this.id = ID;
  }

  update(m) {
    this.timestamp = 0;
    this.present = true;
    this.center = m.center;
    this.corners = m.corners.map(c => c);
    this.rotation = Vec2.angleBetween(
      Vec2.sub(this.corners[0], this.corners[1]),
      new Vec2(1, 0)
    );
  }

  updatePresence(dt) {
    this.timestamp += dt;
    this.present = (this.timestamp >= this.timeout) ? false : true;
  }
}

export default Marker;
