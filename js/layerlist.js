class LayerList {

    constructor() {
        this.layers = [];
    }

    addAssetLayers(asset, onchange) {
        const layer = this.createLayer(asset, false);
        layer.option.addEventListener('change', onchange);
        if (asset.back != null) {
            const backLayer = this.createLayer(asset, true);
            this.moveToBottom(backLayer.id);
            backLayer.option.addEventListener('change', onchange);
        }
        return layer;
    }

    deleteLayer(layerId) {
        this.moveToTop(layerId);
        var topLayer = this.layers.pop();
        layerSelector.removeChild(topLayer.option);
        topLayer.option = null;
        if (this.layers.length == 0) {
            return null;
        } else if (layerId == 0) {
            return this.layers[0];
        } else {
            return this.layers[layerId - 1];
        }
    }

    duplicateLayer(layerId) {
        const layer = this.layers[layerId].clone(this.layer.length);
        this.layers.push(layer);
        return layer;
    }

    setLayerAsset(layerId, asset) {
        this.layers[layerId].asset = asset;
        this.layers[layerId].refreshOption();
    }

    toggleCell(layerId, x, y, cols, rows) {
        const w = this.layers[layerId].asset.img.width / cols + this.layers[layerId].spaceX * 2
        const h = this.layers[layerId].asset.img.height / rows + this.layers[layerId].spaceY * 2
        this.layers[layerId].toggleVisibility(Math.floor(x / w), Math.floor(y / h));
    }

    showCells(layerId) {
        this.layers[layerId].hidden = new Set();
    }

    hideCells(layerId, cols, rows) {
        this.layers[layerId].hidden = new Set();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.layers[layerId].toggleVisibility(j, i);
            }
        }
    }

    setLayerValue(layerId, key, value) {
        if (layerId == -1) {
            for (let l in this.layers) {
                this.layers[l][key] = value;
            }
        } else {
            this.layers[layerId][key] = value;
        }
    }

    increaseLayerValue(layerId, key, value) {
        if (layerId == -1) {
            for (let l in this.layers) {
                this.layers[l][key] += value;
            }
        } else {
            this.layers[layerId][key] += value;
        }
    }

    invertLayerValue(layerId, key) {
        if (layerId == -1) {
            for (let l in this.layers) {
                this.layers[l][key] = !this.layers[l][key];
            }
        } else {
            this.layers[layerId][key] = !this.layers[layerId][key];
        }
    }
 
    draw(cols, rows, ctx) {
        for (let l in this.layers) {
            this.layers[l].draw(cols, rows, ctx);
        }
    }

    setLayerPalette(layerId, colorId, paletteId, r, g, b) {
        this.layers[layerId].setPalette(colorId, paletteId);
        this.layers[layerId].setRGB(colorId, paletteId, r, g, b);
    }

    setLayerRGB(layerId, colorId, selectedPalette, r, g, b) {
        if (selectedPalette == null) {
            this.layers[layerId].setRGB(colorId, -1, r, g, b);
        } else {
            this.layers[layerId].setRGB(colorId, selectedPalette.paletteId, r, g, b);
        }
    }

    createLayer(asset, back) {
        const layer = new Layer(this.layers.length, asset, back);
        this.layers.push(layer);
        layer.refreshOption();
        return layer;
    }

    load(json) {
        const jsonLayers = JSON.parse(json);
        if (jsonLayers == null) {
            alert('Could not parse layers file ' + json);
            return;
        } else if (jsonLayers.length == 0) {
            alert('Empty layer list.');
            return;
        }
        this.layers = [];
        layerSelector.innerHTML = '';
        for (let l in jsonLayers) {
            let asset = document.getElementById(jsonLayers[l].asset);
            let layer = this.createLayer(asset, jsonLayers[l].back);
            layer.decode(jsonLayers[l]);
        }
        selectLayer(this.layers[0]);
        preview.redrawCanvas();
    }
    
    save() {
        let jsonLayers = [];
        for (let l in this.layers) {
            jsonLayers.push(this.layers[l].encode());
        }
        return JSON.stringify(jsonLayers);
    }

    store() {
        window.localStorage.setItem("pcm_layers", this.save());
    }

    moveUp(layerId) {
        this.layers[layerId].swap(this.layers[layerId + 1]);
        return this.layers[layerId + 1]
    }

    moveDown(layerId) { 
        this.layers[layerId].swap(this.layers[layerId - 1]);
        return this.layers[layerId - 1];
    }

    moveToTop(layerId) {
        for (let i = layerId; i < this.layers.length - 1; i++) {
            this.layers[i].swap(this.layers[i + 1]);
        }
        return this.layers[this.layers.length - 1];
    }

    moveToBottom(layerId) {
        for (let i = layerId; i > 0; i--) {
            this.layers[i].swap(this.layers[i - 1]);
        }
        return this.layers[0];
    }

    getLayerAsset(layerId) {
        return this.layers[layerId].asset;
    }

    getMaxWidth(cols) {
        var maxW = 0;
        for (let l in this.layers) {
            maxW = Math.max(maxW, this.layers[l].asset.img.width + this.layers[l].spaceX * 2 * cols);
        }
        return maxW;
    }

    getMaxHeight(rows) {
        var maxH = 0;
        for (let l in this.layers) {
            maxH = Math.max(maxH, this.layers[l].asset.img.height + this.layers[l].spaceY * 2 * rows);
        }
        return maxH;
    }

    getLastId() {
        return this.layers.length - 1;
    }

}