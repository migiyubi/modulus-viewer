import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

export class MaterialManager {
    constructor() {
        this._edgeMaterials = {};
        this._faceMaterials = {};
        this._edgeWidth = 1;
    }

    static get EdgeKeyMain() { return 0; }
    static get EdgeKeySub() { return 1; }
    static get EdgeKeyThumbs() { return 2; }

    static _instance = null;

    static get instance() {
        if (MaterialManager._instance === null) {
            MaterialManager._instance = new MaterialManager();
        }

        return MaterialManager._instance;
    }

    edge(key, color=0x000000, opacity=1.0) {
        const id = key << 24 | color;
        if (this._edgeMaterials[id] === undefined) {
            this._edgeMaterials[id] = new LineMaterial({ color: color, transparent: true, opacity: opacity });

            if (key === MaterialManager.EdgeKeyMain) {
                this.updateEdgeWidth();
            }
            else {
                this._edgeMaterials[id].linewidth = 1;
            }
        }

        return this._edgeMaterials[id];
    }

    face(color) {
        if (this._faceMaterials[color] === undefined) {
            this._faceMaterials[color] = new THREE.MeshLambertMaterial({
                color: color,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1
            });
        }

        return this._faceMaterials[color];
    }

    updateEdgeWidth(width) {
        if (width !== undefined) {
            this._edgeWidth = width;
        }

        for (const k in this._edgeMaterials) {
            const edgeKey = k >> 24;
            if (edgeKey === MaterialManager.EdgeKeyMain) {
                this._edgeMaterials[k].linewidth = this._edgeWidth;
            }
            else if (edgeKey === MaterialManager.EdgeKeySub) {
                this._edgeMaterials[k].linewidth = 0.5 * this._edgeWidth;
            }
        }

        for (const k in this._faceMaterials) {
            this._faceMaterials[k].polygonOffsetFactor = 0.6 * this._edgeWidth;
        }
    }
}
