import { Color } from 'object/Color.js';

export class ColorSelector {
    constructor(onChange) {
        this._root = document.createElement('div');
        this._root.setAttribute('id', 'color-selector');
        this._visibilities = {};
        this._panels = [];

        const icon = document.createElement('div');
        icon.classList.add('icon');
        const img = document.createElement('img');
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACZUlEQVR4AezUi40VMQwF0AeNsFQCVAJUAlvJ0glLJdAJ+ETjUcYk80FIiNU+JRP/rn3tybyXt3/8eybwX07gQ1ybh9jfu/01ZDa+u5BPrysTkFzRvpBi9tuoyM+HDJk9zPvrDAHJs/CZpGKSCOwugyMCnwKtI0lDvLRgYOUgD8F7BIA/D1A/wsb+Mc7Xy34XJxtfiJvFbiJDEjMCio/G9yVSK3ofJ1lB+zF0Nj72UDdLriGJEYFZcV3qepN5oIixqwsJuTeTqAQECKxgY9Rltc90U4CpfsXfh9EZx+3WE3BZRsWN2HgbYHlIYKS+DhtxtsXdDhjYpnQPxJBopiSgMEczloduepNCiua3TodnI/exs6mppeE2ASAd9MBe/tYrITdgnKO1drY4K3YxtwOJOxMwymaZPGoXOp+E3qqvYm/l94DAUZAJ9bjRe+39V+RHBGaXJRN5vyk79whXXyUPn1sj9wgw+MYZyHW/KoYZYfj6/b8p2F5tsUkAuN72DPZe+07EIqxbsjhYNnK/YXs9ZcXh21eQRp25mannqXi93Qor6K/3RQRKyBbiunwtsKthEZC1m5oTaEo8kFidoedCrN6F9I1OsTDVp2tkV3slwCFgRMJ/xawruNw+a7Gp56m4qaXezhEBjhkJXSmAiC5zxN41m8JkOfo9LC5gRoAPCQXru1WYXTF/vz8jGCk2vlA3i/23zjNij4AYdwKRSoLvaMMoLMc09ogAoPG57VeIiIWBlWO6zxBIsIspqa7IkuuSn24r7LMksx/uKwQymcIKIYKQgnT7dOFM9icEEvtXzqdP4GhMvwAAAP//WQqS9wAAAAZJREFUAwA6KnlB4wgDJAAAAABJRU5ErkJggg==';
        icon.appendChild(img);
        this._root.appendChild(icon);

        for (const c of Color.list) {
            this._visibilities[c.enumeration] = true;

            const panel = document.createElement('div');
            panel.classList.add('color-panel');
            panel.dataset.colorCode = c.enumeration;
            panel.style.backgroundColor = c.hexString;
            panel.addEventListener('click', this.onClickPanel.bind(this));
            this._root.appendChild(panel);

            this._panels.push(panel);
        }

        this._onChange = onChange;
    }

    get domElement() { return this._root; }

    onClickPanel(e) {
        const tgt = e.currentTarget;
        const c = tgt.dataset.colorCode;

        this._visibilities[c] = !this._visibilities[c];

        if (this._visibilities[c]) {
            tgt.classList.remove('invisible');
        }
        else {
            tgt.classList.add('invisible');
        }

        this._onChange(this._visibilities);
    }

    getVisibilities() {
        return this._visibilities;
    }
}
