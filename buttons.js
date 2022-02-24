
var colorIds = document.getElementById('colorIds');
var selectedColor = 0;
var canvas = document.getElementById('spritesheet');
var ctx = canvas.getContext('2d');

function setColorIds(img) {
    if (!colorLists.has(img))
        return;
    let n = colorLists.get(img).length;
    console.log("n" + n);
    colorIds.innerHTML = '';
    for (i = 0; i < n; i++) {
        let option = document.createElement('option');
        option.innerHTML = 'Color ' + (i + 1);
        option.value = i;
        const value = i;
        addEventListener('change', function(event) {
            selectedColor = value;
        });
        colorIds.append(option);
    }
}

var selectedCloth = null;
function selectCloth(element, img) {
    if (selectedCloth != null) {
        selectedCloth[0].className = 'cloth';
    }
    selectedCloth = [element, img];
    element.className = 'selectedcloth';
    setColorIds(img);
}

var selectedFolder = null;
function selectFolder(folderDiv) {
    if (selectedFolder != null) {
        selectedFolder.className = 'folder';
    }
    selectedFolder = folderDiv;
    selectedFolder.className = 'selectedfolder';
}

function selectPalette(p) {
    if (selectedLayer != -1) {
        layers[selectedLayer].setPalette(selectedColor, p);
        redrawCanvas();
    }
}

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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