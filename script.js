
var settings = {};
settings.template = 'lth';
settings.bodyFile = 'Body';
settings.rows = 8;
settings.cols = 3;
settings.width = 72;
settings.height = 256;
settings.clothes = [
    'Dress',
    'Tum-Tum'
];
settings.nPalettes = 16;
settings.nTones = 5;

// Elements

var clothSelector = document.getElementById('clothes');
var layerSelector = document.getElementById('layerSelector');
var palettes = document.getElementById('palettes');
var canvas = document.getElementById('spritesheet');
var anim = document.getElementById('animation');
var ctx = canvas.getContext('2d');
var ctxa = canvas.getContext('2d');
canvas.width = settings.width;
canvas.height = settings.height;
anim.width = settings.width / settings.cols;
anim.height = settings.height / settings.rows;
palettes.width = settings.nPalettes * 10;
palettes.height = settings.nTones * 10;

// Layers

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


// Clothes

var selectedCloth = null;
function selectCloth(element, img) {
    if (selectedCloth != null) {
        selectedCloth[0].className = 'cloth';
    }
    selectedCloth = [element, img];
    element.className = 'selectedCloth';
}


// Buttons

function selectLayer(layer) {
    if (layer == null) {
        selectedLayer = -1;
    } else {
        layerSelector.value = layer.option.value;
        selectedLayer = layer.id;
        console.log('Selected ' + layer.option.value + " " + layer.id);
    }
}

function redrawCanvas() {
    ctx.clearRect(0, 0, settings.width, settings.height);
    for(l in layers) {
        layers[l].draw(ctx);
    }
}

function addLayer() {
    if (selectedCloth != null) {
        selectLayer(new Layer(selectedCloth[0], selectedCloth[1]));
        redrawCanvas();
    } else {
        console.log('No cloth selected.');
    }
}

function deleteLayer() {
    if (selectedLayer != -1) {
        layers[selectedLayer].destroy();
        if (layers.length == 0) {
            selectLayer(null);
        } else if (selectedLayer == 0) {
            selectLayer(layers[0]);
        } else {
            selectLayer(layers[selectedLayer - 1])
        }
        redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerUp() {
    if (selectedLayer != -1) {
        if (selectedLayer < layers.length - 1) {
            layers[selectedLayer].moveUp();
            selectLayer(layers[selectedLayer + 1]);
            redrawCanvas();
        } else {
            console.log('Cannot move top layer up.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerDown() {
    if (selectedLayer != -1) {
        if (selectedLayer > 0)  {
            layers[selectedLayer].moveDown();
            selectLayer(layers[selectedLayer - 1]);
            redrawCanvas();
        } else {
            console.log('Cannot more bottom layer down.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerTop() {
    console.log(selectedLayer);
    if (selectedLayer != -1) {
        layers[selectedLayer].moveToTop();
        selectLayer(layers[layers.length - 1]);
        redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerBottom() {
    if (selectedLayer != -1) {
        layers[selectedLayer].moveToBottom();
        selectLayer(layers[0]);
        redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

palettes.addEventListener('click', function(event) {
    var p = event.layerX / 10;
    if (selectedLayer != -1) {
        layers[selectedLayer].palette = p;
        redrawCanvas();
    }
});


// Initial state

function addCloth(name) {
    let img = new Image();
    img.src = 'templates/' + settings.template + '/' + name + '.png';
    let cloth = document.createElement('img');
    cloth.src = img.src;
    cloth.className = 'cloth'
    cloth.id = name;
    cloth.addEventListener('click', function(event) {
        selectCloth(cloth, img);
    });
    clothSelector.append(cloth);
    return img;
}

let bodyImg = addCloth(settings.bodyFile);
selectCloth(clothSelector.firstElementChild, bodyImg);
for (i in settings.clothes) {
    addCloth(settings.clothes[i]);
}
addLayer();

window.onload = function() {
    redrawCanvas();
}
