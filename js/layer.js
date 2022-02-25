
class Layer {

    constructor(asset, img) {
        const layerID = layers.length;
        console.log('New layer' + layerID + ': ' + asset.id);
        this.id = layerID;
        this.asset = asset;
        this.img = img;
        this.offsetX = 0;
        this.offsetY = 0;
        this.colorMap = new Map();
        this.option = document.createElement('option');
        this.option.innerHTML = asset.id;
        this.option.value = '' + this.id;
        this.option.addEventListener('click', function(event) {
            selectedLayer = layerID;
            refreshColorSelector(img);
        });
        layers.push(this);
        layerSelector.prepend(this.option);
    }

    setPalette(colorId, paletteId) {
        let oldPalette = palettes[colorLists.get(this.img)[colorId]];
        let newPalette = palettes[paletteId];
        for (i in oldPalette) {
            this.colorMap.set(pixelToKey(oldPalette[i], 0), newPalette[i]);
        }
    }

    swap(other) {
        let img = other.img;
        let asset = other.asset;
        let offsetX = other.offsetX;
        let offsetY = other.offsetY;
        let colorMap = other.colorMap;
        other.img = this.img;
        other.asset = this.asset;
        other.offsetX = this.offsetX;
        other.offsetY = this.offsetY;
        other.colorMap = this.colorMap;
        this.img = img;
        this.asset = asset;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.colorMap = colorMap;
        // Refresh name
        let innerHTML = other.option.innerHTML;
        other.option.innerHTML = this.option.innerHTML;
        this.option.innerHTML = innerHTML;
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

    draw(ctx) {
        let assetCanvas = document.createElement('canvas');
        assetCanvas.width = this.img.width;
        assetCanvas.height = this.img.height;
        let assetCtx = assetCanvas.getContext('2d');
        assetCtx.drawImage(this.img, 0, 0);
        let imgData = assetCtx.getImageData(0, 0, assetCanvas.width, assetCanvas.height);
        convertPixels(imgData.data, this.colorMap);
        assetCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(assetCanvas, this.offsetX, this.offsetY);
    }

}

function pixelToKey(data, i) {
    return (1 << 24) + (data[i] << 16) + (data[i+1] << 8) + data[i+2];
}

function convertPixels(data, map) {
    for (var i = 0; i < data.length; i += 4) {
        var pixel = pixelToKey(data, i);
        if (map.has(pixel)) {
            pixel = map.get(pixel);
            data[i] = pixel[0];
            data[i + 1] = pixel[1];
            data[i + 2] = pixel[2];
        }
    }
}