class ColorMap {

    constructor(paletteMap, rgbaMap) {
        // Maps paletteIds (int) to paletteIds (int)
        this.paletteMap = new Map(paletteMap);
        // Maps paletteIds (int) to rgba (int, int, int, int)
        this.rgbaMap = new Map(rgbaMap)
    }

    clone() {
        return new ColorMap(this.paletteMap, this.rgbaMap);
    }

    convertPixels(data, layerRgba) {
        for (var p = 0; p < data.length; p += 4) {
            let key = paletteSet.pixelToKey(data, p);
            let tone = paletteSet.getTone(key);
            if (tone != null) {
                if (this.paletteMap.has(tone[0])) {
                    let newPalette = paletteSet.get(this.paletteMap.get(tone[0]));
                    for (let i = 0; i < 3; i++)
                        data[p + i] = newPalette[tone[1]][i];
                }
                if (this.rgbaMap.has(tone[0])) {
                    let rgba = this.rgbaMap.get(tone[0]);
                    for (let i = 0; i < 4; i++)
                        data[p + i] *= rgba[i];
                }
            }
            data[p] *= layerRgba[0];
            data[p + 1] *= layerRgba[1];
            data[p + 2] *= layerRgba[2];
            data[p + 3] *= layerRgba[3];
        }
    }

    mapPalette(oldPaletteId, newPaletteId) {
        this.paletteMap.set(oldPaletteId, newPaletteId);
    }

    mapRGBA(oldPaletteId, rgba, replace) {
        let currentRgba = this.rgbaMap.get(oldPaletteId);
        if (currentRgba == null) {
            currentRgba = [1, 1, 1, 1];
            this.rgbaMap.set(oldPaletteId, currentRgba);
        }
        if (replace) {
            for (let i = 0; i < 4; i++) {
                if (rgba[i] != null) currentRgba[i] = parseInt(rgba[i]) / 100;
            }
        } else {
            for (let i = 0; i < 4; i++) {
                currentRgba[i] = Math.max(0, Math.min(currentRgba[i] + rgba[i] * 0.2, 1));
            }
        }
    }

    encode() {
        return {
            "palette": [...this.paletteMap],
            "rgba": [...this.rgbaMap]
        };
    }
    
    decode(json) {
        this.paletteMap = new Map(json.palette);
        this.rgbaMap = new Map(json.rgba);
    }

}