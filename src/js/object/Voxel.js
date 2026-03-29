import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

import { MaterialManager } from 'object/MaterialManager.js';

export class Voxel extends THREE.Group {
    constructor(color, edgeKey) {
        super();

        this._mesh = new THREE.Mesh(Voxel.BoxGeometry, MaterialManager.instance.face(color));
        this._line = new Line2(Voxel.LineGeometry, MaterialManager.instance.edge(edgeKey, 0x000000));
        this._subLine = new Line2(Voxel.LineGeometry, MaterialManager.instance.edge(MaterialManager.EdgeKeySub, 0x666666, 0.5));

        this.add(this._line);
        this.add(this._mesh);
        this.add(this._subLine);

        this.setVisibility(true);
    }

    static _boxGeometry = null;
    static _lineGeometry = null;

    static get BoxGeometry() {
        if (Voxel._boxGeometry === null) {
            Voxel._boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        }

        return Voxel._boxGeometry;
    }

    static get LineGeometry() {
        if (Voxel._lineGeometry === null) {
            const edge = new THREE.EdgesGeometry(Voxel.BoxGeometry);
            Voxel._lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edge);
            edge.dispose();
        }

        return Voxel._lineGeometry;
    }

    setVisibility(visible) {
        this._mesh.visible = visible;
        this._line.visible = visible;
        this._subLine.visible = !visible;
    }
}
