import { ColorSelector } from 'gui/ColorSelector.js';
import { VolumeDetailText } from 'gui/VolumeDetailText.js';
import { VolumeSelector } from 'gui/VolumeSelector.js';

export class Gui {
    constructor(onChangeVolume, onChangeVisibility) {
        this._root = document.createElement('div');
        this._root.classList.add('overlay');

        this._volumeSelector = new VolumeSelector(onChangeVolume);
        this._root.appendChild(this._volumeSelector.domElement);

        const container = document.createElement('div');
        container.classList.add('overlay-content');
        this._root.appendChild(container);

        this._colorSelector = new ColorSelector(onChangeVisibility);
        container.appendChild(this._colorSelector.domElement);

        this._volumeDetail = new VolumeDetailText();
        container.appendChild(this._volumeDetail.domElement);
    }

    get domElement() { return this._root; }

    updateVolumeDetail(volume) {
        this._volumeDetail.update(volume);
    }

    getVisibilities() {
        return this._colorSelector.getVisibilities();
    }
}
