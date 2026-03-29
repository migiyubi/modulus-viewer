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

class Color_ {
    constructor(displayName, threeCode, hexString, rgbString) {
        this._displayName = displayName;
        this._threeCode = threeCode;
        this._hexString = hexString;
        this._rgbstring = rgbString;
    }

    get displayName() { return this._displayName; }
    get threeCode() { return this._threeCode; }
    get hexString() { return this._hexString; }
    get rgbString() { return this._rgbstring; }

    static get White() { return 1; }
    static get Black() { return 2; }
    static get Blue() { return 3; }
    static get Yellow() { return 4; }

    static _instanceMap = null;

    static get map() {
        if (this._instanceMap === null) {
            this._instanceMap = {};

            for (const data of master) {
                const r = data.threeCode >> 16 & 0xff;
                const g = data.threeCode >> 8 & 0xff;
                const b = data.threeCode & 0xff;

                const hexString = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
                const rgbString = `rgb(${r},${g},${b})`;

                this._instanceMap[data.enumeration] = new Color(
                    data.displayName,
                    data.threeCode,
                    hexString,
                    rgbString
                );
            }
        }

        return this._instanceMap;
    }

    static get(colorCode) {
        return Color.map[colorCode] !== undefined ? Color.map[colorCode] : null;
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
    }
];
