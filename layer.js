
var layerSelector = document.getElementById('layerSelector');
var layers = [];
var selectedLayer = -1;
var palettes = [];
var colorLists = new Map();

function pixelToKey(data, i) {
    return (1 << 24) + (data[i] << 16) + (data[i+1] << 8) + data[i+2];
}

function findPalette(pixel) {
    for (p in palettes) {
        for (t in palettes[p]) {
            let tone = palettes[p][t]
            if (tone[0] == pixel[0] && tone[1] == pixel[1] && tone[2] == pixel[2]) {
                return p;
            }
        }
    }
    return null;
}

function createColorList(img) {
    var colorSet = new Set();
    let clothCanvas = document.createElement('canvas');
    clothCanvas.width = img.width;
    clothCanvas.height = img.height;
    let clothCtx = clothCanvas.getContext('2d');
    clothCtx.drawImage(img, 0, 0);
    let imgData = clothCtx.getImageData(0, 0, clothCanvas.width, clothCanvas.height);
    let data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
        let pixel = [data[i], data[i + 1], data[i + 2]];
        let palette = findPalette(pixel);
        if (palette != null) {
            colorSet.add(p);
        }
    }
    return [...colorSet];
}

class Layer {

    constructor(cloth, img) {
        const layerID = layers.length;
        console.log('New layer' + layerID + ': ' + cloth.id);
        this.id = layerID;
        this.cloth = cloth;
        this.hspace = 0;
        this.vspace = 0;
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
        let hspace = other.hspace;
        let vspace = other.vspace;
        let colorMap = other.colorMap;
        other.img = this.img;
        other.cloth = this.cloth;
        other.hspace = this.hspace;
        other.vspace = this.vspace;
        other.colorMap = this.colorMap;
        this.img = img;
        this.cloth = cloth;
        this.hspace = hspace;
        this.vspace = vspace;
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
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 4) {
            var pixel = pixelToKey(data, i);
            if (this.colorMap.has(pixel)) {
                pixel = this.colorMap.get(pixel);
                data[i] = pixel[0];
                data[i + 1] = pixel[1];
                data[i + 2] = pixel[2];
            }
        }
        clothCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(clothCanvas, 0, 0);
    }

}
