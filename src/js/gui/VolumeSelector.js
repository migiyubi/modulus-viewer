import { VolumeThumbnailRenderer } from 'object/VolumeThumbnailRenderer.js';
import { VolumeMaster } from 'res/VolumeMaster.js';

export class VolumeSelector {
    constructor(onChange) {
        this._root = document.createElement('div');
        this._root.setAttribute('id', 'volume-selector');

        this._onChange = onChange;
        this._renderer = new VolumeThumbnailRenderer();
        this._observer = new IntersectionObserver(this.onIntersect.bind(this));
        this._panelToRefreshQueue = [];

        for (const id in VolumeMaster) {
            const record = VolumeMaster[id];

            for (const [i, v] of record.volumes.entries()) {
                const panel = document.createElement('div');
                panel.classList.add('volume-panel');
                panel.dataset.rendered = false;
                panel.dataset.facilityId = id;
                panel.dataset.volumeIndex = i;
                panel.addEventListener('click', this.onClickPanel.bind(this));
                this._root.appendChild(panel);

                const thumbnail = document.createElement('img');
                thumbnail.classList.add('thumbnail');
                panel.appendChild(thumbnail);

                this._observer.observe(panel);
            }
        }

        this._refreshing = false;
        this.invalidate();
    }

    get domElement() { return this._root; }

    onClickPanel(e) {
        for (const p of this._root.children) {
            if (e.currentTarget === p) {
                p.classList.add('selected');
            }
            else {
                p.classList.remove('selected');
            }
        }

        const { facilityId, volumeIndex } = this.retrieveVolumeInfo(e.currentTarget);
        this._onChange(facilityId, volumeIndex);
    }

    invalidate() {
        if (this._refreshing) {
            return;
        }

        this._refreshing = true;
        setTimeout(this.refreshPanel.bind(this), 1);
    }

    async refreshPanel() {
        const panel = this._panelToRefreshQueue.shift();

        if (panel === undefined) {
            this._refreshing = false;
            return;
        }

        if (panel.dataset.rendered === 'false') {
            const { facilityId, volumeIndex } = this.retrieveVolumeInfo(panel);
            const image = await this._renderer.render(VolumeMaster[facilityId].volumes[volumeIndex]);
            panel.querySelector('.thumbnail').src = image;
            panel.dataset.rendered = true;
        }

        this._refreshing = false;
        this.invalidate();
    }

    onIntersect(entries) {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }

            if (entry.target.dataset.rendered === 'true') {
                continue;
            }

            this._panelToRefreshQueue.push(entry.target);

            if (this._panelToRefreshQueue.length > 20) {
                this._panelToRefreshQueue.shift();
            }
        }

        this.invalidate();
    }

    retrieveVolumeInfo(panel) {
        const facilityId = panel.dataset.facilityId;
        const volumeIndex = parseInt(panel.dataset.volumeIndex, 10);
        return { facilityId, volumeIndex };
    }
}
