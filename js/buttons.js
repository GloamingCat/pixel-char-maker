
// Canvas
function redrawCanvas() {
    var maxW = 0;
    var maxH = 0;
    for(l in layers) {
        maxW = Math.max(maxW, layers[l].img.width + layers[l].spaceX * 2 * canvas.cols);
        maxH = Math.max(maxH, layers[l].img.height + layers[l].spaceY * 2 * canvas.rows);
    }
    canvas.width = maxW;
    canvas.height = maxH;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, maxW, maxH);
    for(l in layers) {
        layers[l].draw(canvas.cols, canvas.rows, ctx);
    }
}

// Folder of assets.
function selectFolder(folderDiv) {
    if (selectedFolder != null) {
        selectedFolder.className = 'folder';
    }
    selectedFolder = folderDiv;
    selectedFolder.className = 'selectedfolder';
}

// Specific piece of asset.
function selectAsset(element, img) {
    if (selectedAsset != null) {
        selectedAsset[0].className = 'asset';
    }
    selectedAsset = [element, img];
    element.className = 'selectedAsset';
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

// Refresh the list of colors of selected asset.
function refreshColorSelector(img) {
    colorSelector.innerHTML = '';
    colorSelector.value = '0';
    if (img == null || !colorLists.has(img)) {
        return;
    }
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

// Spacing
function increaseSpacing(x, y) {
    if (selectedLayer != -1) {
        layers[selectedLayer].spaceX += x;
        layers[selectedLayer].spaceY += y;
        redrawCanvas();
    }
}
function resetSpacing() {
    if (selectedLayer != -1) {
        layers[selectedLayer].spaceX = 0;
        layers[selectedLayer].spaceY = 0;
        redrawCanvas();
    }
}

function addLayer() {
    if (selectedAsset != null) {
        selectLayer(new Layer(selectedAsset[0], selectedAsset[1]));
        redrawCanvas();
    } else {
        console.log('No asset selected.');
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

function replaceLayerImg() {
    if (selectedLayer != -1) {
        if (selectedAsset != null) {
            layers[selectedLayer].replaceImage(selectedAsset[0], selectedAsset[1]);
            redrawCanvas();
        } else {
            console.log('No asset selected.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function duplicateLayer() {
    if (selectedLayer != -1) {
        selectLayer(layers[selectedLayer].clone());
        redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}
