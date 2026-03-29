import * as THREE from 'three';

export class PerspectiveCameraExt extends THREE.PerspectiveCamera {
    constructor() {
        super();
    }

    setParams(aspectRatio, fov, isHorizontalFov=false, autoUpdateProjection=false) {
        if (isHorizontalFov) {
            const horFovRad = fov * Math.PI / 180;
            const fx = Math.tan(0.5 * horFovRad);
            const fy = fx / aspectRatio;
            const verFovRad = 2.0 * Math.atan(fy);
            fov = verFovRad * 180 / Math.PI;
        }

        this.aspect = aspectRatio;
        this.fov = fov;

        if (autoUpdateProjection) {
            this.updateProjectionMatrix();
        }
    }
}
