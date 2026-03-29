import * as THREE from 'three';

import { MaterialManager } from 'object/MaterialManager.js';
import { Volume } from 'object/Volume.js';

export class VolumeThumbnailRenderer {
    constructor() {
        this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this._renderer.setSize(240, 240);

        this._scene = new THREE.Scene();

        this._camera = new THREE.OrthographicCamera(-8, 8, 8, -8);
        this._camera.position.set(20, 20, 20);
        this._camera.lookAt(this._scene.position);

        this._light = new THREE.DirectionalLight(0xffffff, 5);
        this._light.position.set(1, 3, 2);
        this._scene.add(this._light);

        this._ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this._scene.add(this._ambient);

        this._volume = null;
    }

    async render(volumeInfo) {
        if (this._volume !== null) {
            this._scene.remove(this._volume);
        }

        this._volume = new Volume(volumeInfo, MaterialManager.EdgeKeyThumbs);
        this._scene.add(this._volume);
        this._renderer.render(this._scene, this._camera);

        const blob = await this.toBlobAsync(this._renderer.domElement);
        const url = URL.createObjectURL(blob);

        return url;
    }

    toBlobAsync(canvas) {
        return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    }
}
