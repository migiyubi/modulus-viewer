import 'main.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Gui } from 'gui/Gui.js';
import { AxesRenderer } from 'object/AxesRenderer.js';
import { MaterialManager } from 'object/MaterialManager.js';
import { PerspectiveCameraExt } from 'object/PerspectiveCameraExt.js';
import { Volume } from 'object/Volume.js';
import { VolumeMaster } from 'res/VolumeMaster.js';

class App {
    constructor() {
        this._params = {
            backgroundColor: 0x94949c,
            cameraPositionDefaultX: 16,
            cameraPositionDefaultY: 13,
            cameraPositionDefaultZ: 16,
            cameraFov: 40,
            directionalLightIntensity: 3,
            ambientLightIntensity: 1,
            edgeWidthRatio: 1.0 / 400,
        };

        this._gui = new Gui(this.updateVolume.bind(this), this.updateVisibility.bind(this));
        document.body.appendChild(this._gui.domElement);

        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.autoClear = false;
        this._renderer.setAnimationLoop(this.animationLoop.bind(this));
        document.body.appendChild(this._renderer.domElement);

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(this._params.backgroundColor);

        this._camera = new PerspectiveCameraExt();
        this._camera.position.set(this._params.cameraPositionDefaultX,
                                  this._params.cameraPositionDefaultY,
                                  this._params.cameraPositionDefaultZ);
        this._camera.lookAt(this._scene.position);
        this._scene.add(this._camera);

        this._light = new THREE.DirectionalLight(0xffffff, this._params.directionalLightIntensity);
        this._light.position.set(2, 0, 0);
        this._camera.add(this._light);

        this._ambient = new THREE.AmbientLight(0xffffff, this._params.ambientLightIntensity);
        this._scene.add(this._ambient);

        this._axesRenderer = new AxesRenderer();

        this._curVolume = null;

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enablePan = false;
        this._controls.enableZoom = false;

        window.addEventListener('resize', this.throttle(this.onResize.bind(this), 50));
        this.onResize();
    }

    onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / h;

        this._renderer.setSize(w, h);
        this._camera.setParams(aspect, this._params.cameraFov, aspect < 1.0, true);
        MaterialManager.instance.updateEdgeWidth(this._params.edgeWidthRatio * h);
    }

    throttle(func, interval) {
        let lastTime = 0;
        let timerId = null;

        return (...args) => {
            const now = Date.now();
            const remaining = interval - now + lastTime;

            if (timerId !== null) {
                clearTimeout(timerId);
            }

            if (remaining <= 0) {
                func.apply(this, args);
                lastTime = now;
            }
            else {
                timerId = setTimeout(() => {
                    func.apply(this, args);
                    lastTime = Date.now();
                }, remaining);
            }
        };
    }

    animationLoop() {
        this._controls.update();

        this._renderer.clear();
        this._renderer.render(this._scene, this._camera);
        this._axesRenderer.render(this._renderer, this._camera);
    }

    updateVolume(facilityId, volumeIndex) {
        if (this._curVolume !== null) {
            this._scene.remove(this._curVolume);
        }

        this._curVolume = new Volume(VolumeMaster[facilityId].volumes[volumeIndex]);
        this._scene.add(this._curVolume);

        this.updateVisibility(this._gui.getVisibilities());

        this._gui.updateVolumeDetail(this._curVolume);

        this.reset();
    }

    updateVisibility(visibilities) {
        if (this._curVolume !== null) {
            this._curVolume.updateVisibility(visibilities);
        }
    }

    reset() {
        this._controls.reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
