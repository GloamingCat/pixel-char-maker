class Layer {

    constructor(id, asset, back) {
        this.id = id;
        this.asset = asset;
        this.back = back;
        this.offsetX = 0;
        this.offsetY = 0;
        this.spaceX = 0;
        this.spaceY = 0;
        this.flip = false;
        this.hidden = new Set();
        this.colorMap = new ColorMap();
        this.rgba = [1.0, 1.0, 1.0, 1.0];
        this.createOption();
    }

    createOption() {        
        this.option = document.createElement('option');
        this.option.innerHTML = this.asset == null ? "<null>" : this.asset.id;
        this.option.value = this.id;
        const self = this;
        this.option.addEventListener('click', function() {
            refreshColorSelector(self.asset);
        });
        layerSelector.prepend(this.option);
    }

    refreshOption() {
        this.option.value = this.id;
        if (this.asset == null) {
            this.option.innerHTML = "<null>";
        } else if (this.back) {
            this.option.innerHTML = 'b' + this.asset.id;
        } else {
            this.option.innerHTML = this.asset.id;
        }
    }

    clone(id) {
        var copy = new Layer(id, this.asset, this.back);
        copy.offsetX = this.offsetX;
        copy.offsetY = this.offsetY;
        copy.spaceX = this.spaceX;
        copy.spaceY = this.spaceY;
        copy.hidden = new Set(this.hidden);
        copy.colorMap = this.colorMap.clone();
        copy.rgba = [this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3]];
        copy.refreshOption();
        return copy;
    }

    toggleVisibility(j, i) {
        const key = i + "_" + j;
        if (this.hidden.has(key)) {
            this.hidden.delete(key);
        } else {
            this.hidden.add(key);
        }
    }

    setPalette(colorId, paletteId) {
        var oldPaletteId = paletteSet.getDefaultPalettes(this.asset)[colorId];
        this.colorMap.mapPalette(oldPaletteId, paletteId);
    }

    setRGBA(colorId, rgba, replace) {
        if (colorId == -1) {
            if (replace) {
                for (i in this.rgba) {
                    if (rgba[i] != null) this.rgba[i] = parseInt(rgba[i]) / 100.0;
                }
            } else {
                for (i in this.rgba) {
                    this.rgba[i] = Math.max(0, Math.min(this.rgba[i] + rgba[i] * 0.2, 1));
                }
            }
            return;
        }
        let oldPaletteId = paletteSet.getDefaultPalettes(this.asset)[colorId];
        this.colorMap.mapRGBA(oldPaletteId, rgba, replace)
    }

    swap(other) {
        let asset = other.asset;
        let back = other.back;
        let offsetX = other.offsetX;
        let offsetY = other.offsetY;
        let spaceX = other.spaceX;
        let spaceY = other.spaceY;
        let flip = other.flip;
        let hidden = other.hidden;
        let colorMap = other.colorMap;
        let rgba = other.rgba;
        other.asset = this.asset;
        other.back = this.back;
        other.offsetX = this.offsetX;
        other.offsetY = this.offsetY;
        other.spaceX = this.spaceX;
        other.spaceY = this.spaceY;
        other.flip = this.flip;
        other.hidden = this.hidden;
        other.colorMap = this.colorMap;
        other.rgba = this.rgba;
        this.asset = asset;
        this.back = back;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.spaceX = spaceX;
        this.spaceY = spaceY;
        this.flip = flip;
        this.hidden = hidden;
        this.colorMap = colorMap;
        this.rgba = rgba;
        // Refresh name
        other.refreshOption();
        this.refreshOption();
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
        this.colorMap.convertPixels(imgData.data, this.rgba);
        assetCtx.putImageData(imgData, 0, 0);
        var sw = img.width / cols;
        var sh = img.height / rows;
        if (this.flip) {
            ctx.scale(-1, 1);
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (!this.hidden.has(i + "_" + j)) {
                        var x = this.offsetX + sw * j + this.spaceX * (j + 1) + this.spaceX * j;
                        var y = this.offsetY + sh * i + this.spaceY * (i + 1) + this.spaceY * i;
                        ctx.drawImage(assetCanvas, sw * j, sh * i, sw, sh, -sw-x, y, sw, sh);
                    }
                }
            }
            ctx.resetTransform();
        } else {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (!this.hidden.has(i + "_" + j)) {
                        var x = this.offsetX + sw * j + this.spaceX * (j + 1) + this.spaceX * j;
                        var y = this.offsetY + sh * i + this.spaceY * (i + 1) + this.spaceY * i;
                        ctx.drawImage(assetCanvas, sw * j, sh * i, sw, sh, x, y, sw, sh);
                    }
                }
            }
        }
    }

    encode() {
        return {
            "asset": this.asset.id,
            "back": this.back,
            "offsetX": this.offsetX,
            "offsetY": this.offsetY,
            "spaceX": this.spaceX,
            "spaceY": this.spaceY,
            "flip": this.flip,
            "rgba": this.rgba,
            "hidden": [...this.hidden],
            "colorMap": this.colorMap.encode()
        };
    }

    decode(json) {
        this.offsetX = json.offsetX;
        this.offsetY = json.offsetY;
        this.spaceX = json.spaceX;
        this.spaceY = json.spaceY;
        this.flip = json.flip;
        if (json.rgb != null) {
            this.rgba = json.rgb;
            this.rgba.push(1);
        } else {
            this.rgba = json.rgba == null ? [1, 1, 1, 1] : json.rgba;
            this.colorMap.decode(json.colorMap);
        }
        this.hidden = new Set(json.hidden);
    }

}