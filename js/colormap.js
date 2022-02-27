class ColorMap {

    constructor(copy) {
        this.map = new Map(copy);
    }

    clone() {
        return new ColorMap(this.map);
    }

    pixelToKey(data, i) {
        return (1 << 24) + (data[i] << 16) + (data[i+1] << 8) + data[i+2];
    }
    
    convertPixels(data, rgb) {
        for (var i = 0; i < data.length; i += 4) {
            let key = this.pixelToKey(data, i);
            if (this.map.has(key)) {
                let rgb = this.map.get(key);
                data[i] = rgb[0];
                data[i + 1] = rgb[1];
                data[i + 2] = rgb[2];
            }
            data[i] *= rgb[0];
            data[i + 1] *= rgb[1];
            data[i + 2] *= rgb[2];
        }
    }

    mapTones(oldPalette, newPalette) {
        for (let i in oldPalette) {
            let key = this.pixelToKey(oldPalette[i], 0);
            this.map.set(key, newPalette[i]);
        }
    }

    changeRGB(oldPalette, newPalette, r, g, b) {
        for (let i in oldPalette) {
            var key = this.pixelToKey(oldPalette[i], 0);
            var currentColor = this.map.get(key);
            if (currentColor == null) currentColor = oldPalette[i];
            var newr = r == null ? currentColor[0] : newPalette[i][0] * r / 100.0;
            var newg = g == null ? currentColor[1] : newPalette[i][1] * g / 100.0;
            var newb = b == null ? currentColor[2] : newPalette[i][2] * b / 100.0;
            this.map.set(key, [newr, newg, newb]);
        }
    }

    encode() {
        return [...this.map];
    }
    
    decode(json) {
        this.map = new Map(json);
    }

}