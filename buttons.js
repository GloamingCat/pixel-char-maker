
// Canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(l in layers) {
        layers[l].draw(ctx);
    }
}

// Folder of clothes.
function selectFolder(folderDiv) {
    if (selectedFolder != null) {
        selectedFolder.className = 'folder';
    }
    selectedFolder = folderDiv;
    selectedFolder.className = 'selectedfolder';
}

// Specific piece of cloth.
function selectCloth(element, img) {
    if (selectedCloth != null) {
        selectedCloth[0].className = 'cloth';
    }
    selectedCloth = [element, img];
    element.className = 'selectedcloth';
}

// Layer list.
function selectLayer(layer) {
    if (layer == null) {
        selectedLayer = -1;
        refreshColorSelector(null);
    } else {
        layerSelector.value = layer.option.value;
        selectedLayer = layer.id;
        refreshColorSelector(layer.img);
    }
    if (selectedPalette != null) {
        selectedPalette.className = 'color'
    }
}

// Refresh the list of colors of selected cloth.
function refreshColorSelector(img) {
    colorSelector.innerHTML = '';
    colorSelector.value = 0;
    if (img == null || !colorLists.has(img))
        return;
    let n = colorLists.get(img).length;
    for (i = 0; i < n; i++) {
        let option = document.createElement('option');
        option.innerHTML = 'Color ' + (i + 1);
        option.value = i;
        colorSelector.addEventListener('change', function(event) {
            selectedColor = event.target.value;
            if (selectedPalette != null) {
                selectedPalette.className = 'color'
            }
        });
        colorSelector.append(option);
    }
    if (selectedPalette != null) {
        selectedPalette.className = 'color'
    }
}

// Color buttons.
function selectPalette(p, button) {
    if (selectedLayer != -1) {
        console.log('Selected palette: ' + p);
        layers[selectedLayer].setPalette(selectedColor, p);
        redrawCanvas();
        if (selectedPalette != null) {
            selectedPalette.className = 'color';
        }
        selectedPalette = button;
        button.className = 'selectedcolor';
    }
}

// Offset
function increaseOffset(x, y) {
    if (selectedLayer != -1) {
        layers[selectedLayer].offsetX += x;
        layers[selectedLayer].offsetY += y;
        redrawCanvas();
    }
}

function resetOffset() {
    if (selectedLayer != -1) {
        layers[selectedLayer].offsetX = 0;
        layers[selectedLayer].offsetY = 0;
        redrawCanvas();
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