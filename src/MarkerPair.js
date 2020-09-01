import * as mathjs from 'mathjs';
import Vec2 from './utils/Vec2';
import { calDistortionMatrices, matrixTransform } from './utils/Distortion';

class MarkerPair {
  constructor(markerA, markerB) {
    this.markerA = markerA;
    this.markerB = markerB;
  }

  get isPresent() {
    return (this.markerA.present && this.markerB.present);
  }

  get angleBetween() {
    return this.markerA.rotation - this.markerB.rotation;
  }

  get distance() {
    return Vec2.sub(this.markerA.center, this.markerB.center).mag();
  }

  getRelativePosition(markerSize) {
    //actual physical width of markerA
    if (this.isPresent()) {
      const physCorners = [
        { x: -markerSize / 2, y: -markerSize / 2 },
        { x: markerSize / 2, y: -markerSize / 2 },
        { x: markerSize / 2, y: markerSize / 2 },
        { x: -markerSize / 2, y: markerSize / 2 }
      ];

      const matrixRect2Quad = calDistortionMatrices(
        this.markerA.corners[0],
        this.markerA.corners[1],
        this.markerA.corners[2],
        this.markerA.corners[3],
        physCorners[0],
        physCorners[1],
        physCorners[2],
        physCorners[3]
      );

      const matrixQuad2Rect = mathjs.inv(matrixRect2Quad);
      const q2r = v => matrixTransform(matrixQuad2Rect, v);

      const centerA = q2r(this.markerA.center);
      const centerB = q2r(this.markerB.center);
      const cornerA0 = q2r(this.markerA.corners[0]);
      const cornerA1 = q2r(this.markerA.corners[1]);
      const cornerB0 = q2r(this.markerB.corners[0]);
      const cornerB1 = q2r(this.markerB.corners[1]);

      const vecAB = vecSub(centerA, centerB);
      const vecA01 = vecSub(cornerA0, cornerA1);
      const d = vecMag(vecAB);
      const head = vecAngleBetween(vecA01, vecAB);
      const angle = vecAngleBetween(vecA01, vecSub(cornerB0, cornerB1));

      return { distance: d, heading: head, rotation: angle };
    }

    return { distance: undefined, heading: undefined, rotation: undefined }; // Maybe return something else if not present?
  }
}

export default MarkerPair;
