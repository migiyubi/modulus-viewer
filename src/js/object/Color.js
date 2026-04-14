export class Color {
    constructor() {
        this._list = master.slice();
        for (const e of this._list) {
            const r = e.threeCode >> 16 & 0xff;
            const g = e.threeCode >> 8 & 0xff;
            const b = e.threeCode & 0xff;

            const hexString = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
            const rgbString = `rgb(${r},${g},${b})`;

            e.hexString = hexString;
            e.rgbString = rgbString;
        }
    }

    static get White() { return 1; }
    static get Black() { return 2; }
    static get Blue() { return 3; }
    static get Yellow() { return 4; }
    static get Red() { return 5; }

    static _instance = null;

    static get instance() {
        if (Color._instance === null) {
            Color._instance = new Color();
        }

        return Color._instance;
    };

    static get list() { return Color.instance._list; }

    static get(colorCode) {
        const m = Color.instance._list.filter(e => e.enumeration === colorCode);
        return m.length > 0 ? m[0] : null;
    }
}

const master = [
    {
        enumeration: Color.White,
        threeCode: 0xcfcfcf,
        displayName: 'white'
    },
    {
        enumeration: Color.Black,
        threeCode: 0x58575f,
        displayName: 'black'
    },
    {
        enumeration: Color.Blue,
        threeCode: 0x4aadd7,
        displayName: 'blue'
    },
    {
        enumeration: Color.Yellow,
        threeCode: 0xffbb66,
        displayName: 'yellow'
    },
    {
        enumeration: Color.Red,
        threeCode: 0xc43838,
        displayName: 'red'
    }
];
