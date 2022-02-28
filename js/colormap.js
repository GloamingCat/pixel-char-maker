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
    
    convertPixels(data, layerRgba) {
        for (var i = 0; i < data.length; i += 4) {
            let key = this.pixelToKey(data, i);
            if (this.map.has(key)) {
                let rgba = this.map.get(key);
                data[i] = rgba[0];
                data[i + 1] = rgba[1];
                data[i + 2] = rgba[2];
                data[i + 3] *= rgba[3] / 255;
            }
            data[i] *= layerRgba[0];
            data[i + 1] *= layerRgba[1];
            data[i + 2] *= layerRgba[2];
            data[i + 3] *= layerRgba[3];
        }
    }

    mapTones(oldPalette, newPalette) {
        for (let t in oldPalette) {
            let key = this.pixelToKey(oldPalette[t], 0);
            this.map.set(key, newPalette[t]);
        }
    }

    mapRGBA(oldPalette, newPalette, newrgba) {
        for (let t in oldPalette) {
            var key = this.pixelToKey(oldPalette[t], 0);
            var currentColor = this.map.get(key);
            if (currentColor == null) currentColor = oldPalette[t];
            let rgba = [0, 0, 0];
            for (let i in rgba) {
                rgba[i] = newrgba[i] == null ? currentColor[i] : newPalette[t][i] * newrgba[i] / 100.0;
            }
            let a = currentColor.length == 3 ? 255 : currentColor[3];
            let newa = newPalette[t].length == 3 ? 255 : newPalette[t][3];
            rgba.push(newrgba[3] == null ? a : newrgba[3] * newa / 100.0);
            console.log(rgba);
            this.map.set(key, rgba);
        }
    }

    encode() {
        return [...this.map];
    }
    
    decode(json) {
        this.map = new Map(json);
    }

}