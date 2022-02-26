
class Layer {

    constructor(asset, back) {
        this.id = layers.length;
        this.asset = asset;
        this.back = back;
        this.offsetX = 0;
        this.offsetY = 0;
        this.spaceX = 0;
        this.spaceY = 0;
        this.hidden = new Set();
        this.colorMap = new Map();
        this.rgb = [1.0, 1.0, 1.0];
        this.option = document.createElement('option');
        this.option.innerHTML = asset.id;
        this.option.value = '' + this.id;
        const self = this;
        this.option.addEventListener('click', function(event) {
            selectedLayer = self.id;
            refreshColorSelector(self.asset);
        });
        layers.push(this);
        layerSelector.prepend(this.option);
    }

    clone() {
        var copy = new Layer(this.asset);
        copy.offsetX = this.offsetX;
        copy.offsetY = this.offsetY;
        copy.spaceX = this.offsetX;
        copy.spaceY = this.offsetY;
        copy.back = this.back;
        copy.hidden = new Set(this.hidden);
        copy.colorMap = new Map(this.colorMap);
        copy.rgb = [this.rgb[0], this.rgb[1], this.rgb[2]];
        copy.refreshOption();
        return copy;
    }

    refreshOption() {
        this.option.value = '' + this.id;
        if (this.back) {
            this.option.innerHTML = this.asset.id + ' - back';
        } else {
            this.option.innerHTML = this.asset.id;
        }
    }

    setPalette(colorId, paletteId) {
        let oldPalette = palettes[colorLists.get(this.asset)[colorId]];
        let newPalette = palettes[paletteId];
        for (i in oldPalette) {
            this.colorMap.set(pixelToKey(oldPalette[i], 0), newPalette[i]);
        }
    }

    setRGB(colorId, paletteId, r, g, b) {
        if (colorId == -1) {
            if (r != null) this.rgb[0] = r / 100.0;
            if (g != null) this.rgb[1] = g / 100.0;
            if (b != null) this.rgb[2] = b / 100.0;
            return;
        } else if (paletteId == -1) {
            let oldPalette = palettes[colorLists.get(this.asset)[colorId]];
            for (i in oldPalette) {
                var key = pixelToKey(oldPalette[i], 0);
                var currentColor = this.colorMap.get(key);
                if (currentColor == null) currentColor = oldPalette[i];
                var newr = r == null ? currentColor[0] : oldPalette[i][0] * r / 100.0;
                var newg = g == null ? currentColor[1] : oldPalette[i][1] * g / 100.0;
                var newb = b == null ? currentColor[2] : oldPalette[i][2] * b / 100.0;
                this.colorMap.set(key, [newr, newg, newb]);
            }
        } else {
            let oldPalette = palettes[colorLists.get(this.asset)[colorId]];
            let newPalette = palettes[paletteId];
            for (i in oldPalette) {
                var key = pixelToKey(oldPalette[i], 0);
                var currentColor = this.colorMap.get(key);
                if (currentColor == null) currentColor = oldPalette[i];
                var newr = r == null ? currentColor[0] : newPalette[i][0] * r / 100.0;
                var newg = g == null ? currentColor[1] : newPalette[i][1] * g / 100.0;
                var newb = b == null ? currentColor[2] : newPalette[i][2] * b / 100.0;
                this.colorMap.set(key, [newr, newg, newb]);
            }
        }
    }

    swap(other) {
        let asset = other.asset;
        let back = other.back;
        let offsetX = other.offsetX;
        let offsetY = other.offsetY;
        let spaceX = other.spaceX;
        let spaceY = other.spaceY;
        let hidden = other.hidden;
        let colorMap = other.colorMap;
        let rgb = other.rgb;
        other.asset = this.asset;
        other.back = this.back;
        other.offsetX = this.offsetX;
        other.offsetY = this.offsetY;
        other.spaceX = this.spaceX;
        other.spaceY = this.spaceY;
        other.hidden = this.hidden;
        other.colorMap = this.colorMap;
        other.rgb = this.rgb;
        this.asset = asset;
        this.back = back;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.spaceX = spaceX;
        this.spaceY = spaceY;
        this.hidden = hidden;
        this.colorMap = colorMap;
        this.rgb = rgb;
        // Refresh name
        other.refreshOption();
        this.refreshOption();
    }

    moveUp() {
        let i = layers.indexOf(this);
        this.swap(layers[i + 1]);
    }

    moveDown() { 
        let i = layers.indexOf(this);
        this.swap(layers[i - 1]);
    }

    moveToTop() {
        for (i = layers.indexOf(this); i < layers.length - 1; i++) {
            layers[i].swap(layers[i + 1]);
        }
    }

    moveToBottom() {
        for (i = layers.indexOf(this); i > 0; i--) {
            layers[i].swap(layers[i - 1]);
        }
    }

    destroy() {
        this.moveToTop();
        var topLayer = layers.pop();
        layerSelector.removeChild(topLayer.option);
        topLayer.option = null;
    }

    draw(cols, rows, ctx) {
        var img = this.back ? this.asset.back : this.asset.img;
        if (img == null)
            return;
        let assetCanvas = document.createElement('canvas');
        assetCanvas.width = img.width;
        assetCanvas.height = img.height;
        let assetCtx = assetCanvas.getContext('2d');
        assetCtx.drawImage(img, 0, 0);
        let imgData = assetCtx.getImageData(0, 0, assetCanvas.width, assetCanvas.height);
        convertPixels(imgData.data, this.colorMap, this.rgb);
        assetCtx.putImageData(imgData, 0, 0);
        var sw = img.width / cols;
        var sh = img.height / rows;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                if (!this.hidden.has(i + "_" + j)) {
                    var x = this.offsetX + sw * j + this.spaceX * (j + 1) + this.spaceX * j;
                    var y = this.offsetY + sh * i + this.spaceY * (i + 1) + this.spaceY * i;
                    ctx.drawImage(assetCanvas, sw * j, sh * i, sw, sh, x, y, sw, sh);
                }
            }
        }
    }

    encode() {
        return {
            "asset": this.asset.id,
            "back": this.back,
            "offsetX": this.offsetX,
            "offsetY": this.offsetX,
            "spaceX": this.offsetX,
            "spaceY": this.offsetX,
            "rgb": this.rgb,
            "hidden": [...this.hidden],
            "colorMap": [...this.colorMap]
        };
    }

    decode(json) {
        this.offsetX = json.offsetX;
        this.offsetY = json.offsetY;
        this.spaceX = json.spaceX;
        this.spaceY = json.spaceY;
        this.rgb = json.rgb;
        this.hidden = new Set(json.hidden);
        this.colorMap = new Map(json.colorMap);
    }

}

function pixelToKey(data, i) {
    return (1 << 24) + (data[i] << 16) + (data[i+1] << 8) + data[i+2];
}

function convertPixels(data, map, rgb) {
    for (var i = 0; i < data.length; i += 4) {
        var pixel = pixelToKey(data, i);
        if (map.has(pixel)) {
            pixel = map.get(pixel);
            data[i] = pixel[0];
            data[i + 1] = pixel[1];
            data[i + 2] = pixel[2];
        }
        data[i] *= rgb[0];
        data[i + 1] *= rgb[1];
        data[i + 2] *= rgb[2];
    }
}
