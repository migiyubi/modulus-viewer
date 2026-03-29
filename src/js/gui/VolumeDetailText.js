import { Color } from 'object/Color.js';

export class VolumeDetailText {
    constructor() {
        this._root = document.createElement('div');
        this._root.setAttribute('id', 'volume-detail');

        this._divName = document.createElement('div');
        this._divName.textContent = '-';
        this._root.appendChild(this._divName);

        this._table = document.createElement('table');
        this._table.setAttribute('id', 'volume-detail-table');
        this._root.appendChild(this._table);

        const [rowSize, cellSize] = this.createRow('Size');
        this._valueSize = cellSize;
        this._table.appendChild(rowSize);

        const [rowVolume, cellVolume] = this.createRow('Volume');
        this._valueVolume = cellVolume;
        this._table.appendChild(rowVolume);

        this._valueVolumeMap = {};
        for (const c of Color.list) {
            const [row, cell] = this.createRow(`Volume (${c.displayName})`);
            this._valueVolumeMap[c.enumeration] = cell;
            this._table.appendChild(row);
        }
    }

    get domElement() { return this._root; }

    createRow(label) {
        const tr = document.createElement('tr');

        const tdLabel = document.createElement('td');
        tdLabel.textContent = label;
        tr.appendChild(tdLabel);

        const tdContent = document.createElement('td');
        tr.appendChild(tdContent);

        return [tr, tdContent];
    }

    update(volume) {
        this._divName.textContent = volume.displayName;
        this._valueVolume.textContent = `${volume.volume}`;
        for (const c of Color.list) {
            this._valueVolumeMap[c.enumeration].textContent = volume.colorVolumes[c.enumeration];
        }
        this._valueSize.textContent = `${volume.dims[0]}x${volume.dims[1]}x${volume.dims[2]}`;
    }
}
