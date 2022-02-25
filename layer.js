
class Layer {

    constructor(cloth, img) {
        const layerID = layers.length;
        console.log('New layer' + layerID + ': ' + cloth.id);
        this.id = layerID;
        this.cloth = cloth;
        this.offsetX = 0;
        this.offsetY = 0;
        this.img = img;
        this.colorMap = new Map();
        this.option = document.createElement('option');
        this.option.innerHTML = cloth.id;
        this.option.value = '' + this.id;
        this.option.addEventListener('click', function(event) {
            selectedLayer = layerID;
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
        let cloth = other.cloth;
        let offsetX = other.offsetX;
        let offsetY = other.offsetY;
        let colorMap = other.colorMap;
        other.img = this.img;
        other.cloth = this.cloth;
        other.offsetX = this.offsetX;
        other.offsetY = this.offsetY;
        other.colorMap = this.colorMap;
        this.img = img;
        this.cloth = cloth;
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
        let clothCanvas = document.createElement('canvas');
        clothCanvas.width = this.img.width;
        clothCanvas.height = this.img.height;
        let clothCtx = clothCanvas.getContext('2d');
        clothCtx.drawImage(this.img, 0, 0);
        let imgData = clothCtx.getImageData(0, 0, clothCanvas.width, clothCanvas.height);
        convertPixels(imgData.data, this.colorMap);
        clothCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(clothCanvas, this.offsetX, this.offsetY);
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