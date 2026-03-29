import * as THREE from 'three';

import { Color } from 'object/Color.js';
import { MaterialManager } from 'object/MaterialManager.js';
import { Voxel } from 'object/Voxel.js';

export class Volume extends THREE.Group {
    constructor(volumeRecord, edgeKey=MaterialManager.EdgeKeyMain) {
        super();

        const countX = volumeRecord.dims[0];
        const countY = volumeRecord.dims[1];
        const countZ = volumeRecord.dims[2];

        const offsetX = (countX - 1) / 2;
        const offsetY = (countY - 1) / 2;
        const offsetZ = (countZ - 1) / 2;

        this._subGroups = {};
        for (const c of Color.list) {
            this._subGroups[c.enumeration] = new THREE.Group();
            this.add(this._subGroups[c.enumeration]);
        }

        this._volume = 0;
        this._colorVolumes = {};
        for (const c of Color.list) {
            this._colorVolumes[c.enumeration] = 0;
        }

        for (let i = 0; i < countZ; i++) {
            for (let j = 0; j < countY; j++) {
                for (let k = 0; k < countX; k++) {
                    const c = volumeRecord.data[i*countY*countX + j*countX + k];
                    const obj = Color.get(c);

                    if (obj === null) {
                        continue;
                    }

                    const v = new Voxel(obj.threeCode, edgeKey);
                    v.position.set(k-offsetX, j-offsetY, i-offsetZ);
                    this._subGroups[c].add(v);

                    ++this._volume;
                    ++this._colorVolumes[c];
                }
            }
        }

        this._displayName = volumeRecord.name;
        this._dims = volumeRecord.dims;
    }

    get displayName() { return this._displayName; }
    get dims() { return this._dims; }
    get volume() { return this._volume; }
    get colorVolumes() { return this._colorVolumes; }

    updateVisibility(visibilities) {
        for (const k in this._subGroups) {
            if (visibilities[k] !== undefined) {
                for (const v of this._subGroups[k].children) {
                    v.setVisibility(visibilities[k]);
                }
            }
        }
    }
}
