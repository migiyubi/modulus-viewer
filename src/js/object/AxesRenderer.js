import * as THREE from 'three';

export class AxesRenderer {
    constructor(viewportHeightRatio=0.125) {
        this._scene = new THREE.Scene();
        this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
        this._axes = new THREE.AxesHelper(0.8);
        this._axes.setColors(0xff0000, 0x00ff00, 0x0000ff);
        this._scene.add(this._axes);

        this._viewportHeightRatio = viewportHeightRatio;
        this._viewportCache = new THREE.Vector4();
    }

    render(parentRenderer, parentCamera) {
        parentRenderer.getViewport(this._viewportCache);

        const s = this._viewportHeightRatio * (this._viewportCache.w - this._viewportCache.y);
        parentRenderer.setViewport(this._viewportCache.z - s, 0, s, s);

        this._camera.quaternion.copy(parentCamera.quaternion);
        this._camera.position.copy(parentCamera.position);
        parentRenderer.render(this._scene, this._camera);

        parentRenderer.setViewport(this._viewportCache);
    }
}
