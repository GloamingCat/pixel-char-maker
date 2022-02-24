
var layerSelector = document.getElementById('layerSelector');
var layers = [];
var selectedLayer = -1;

class Layer {

    constructor(cloth, img) {
        const layerID = layers.length;
        console.log('New layer' + layerID + ': ' + cloth.id);
        this.id = layerID;
        this.cloth = cloth;
        this.hspace = 0;
        this.vspace = 0;
        this.palette = 0;
        this.img = img;
        this.option = document.createElement('option');
        this.option.innerHTML = cloth.id;
        this.option.value = '' + this.id;
        this.option.addEventListener('click', function(event) {
            selectedLayer = layerID;
        });
        layers.push(this);
        layerSelector.prepend(this.option);
    }

    swap(other) {
        let img = other.img;
        let cloth = other.cloth;
        let hspace = other.hspace;
        let vspace = other.vspace;
        let palette = other.palette;
        other.img = this.img;
        other.cloth = this.cloth;
        other.hspace = this.hspace;
        other.vspace = this.vspace;
        other.palette = this.palette;
        this.img = img;
        this.cloth = cloth;
        this.hspace = hspace;
        this.vspace = vspace;
        this.palette = palette;
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
        ctx.drawImage(this.img, 0, 0);
        // TODO: apply spacing and palette change
    }

}
