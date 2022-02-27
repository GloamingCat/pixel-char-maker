// Folder of assets.
function selectFolder(folderDiv) {
    if (selectedFolder != null) {
        selectedFolder.className = 'folder';
    }
    selectedFolder = folderDiv;
    selectedFolder.className = 'selectedfolder';
}

// Specific piece of asset.
function selectAsset(element) {
    if (selectedAsset != null) {
        selectedAsset.className = 'asset';
    }
    selectedAsset = element;
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
        refreshColorSelector(layer.asset);
    }
    deselectPalette();
}

// Refresh the list of colors of selected asset.
function refreshColorSelector(asset) {
    colorSelector.innerHTML = '';
    colorSelector.value = '0';
    selectedColor = -1;
    if (asset.img == null || !paletteSet.getDefaultPalettes(asset)) {
        return;
    }
    let n = paletteSet.getDefaultPalettes(asset).length;
    for (let i = 0; i < n; i++) {
        let option = document.createElement('option');
        option.innerHTML = 'Color ' + (i + 1);
        option.value = i;
        colorSelector.addEventListener('change', function(event) {
            selectedColor = event.target.value;
            deselectPalette();
        });
        colorSelector.append(option);
    }
    if (n > 0) {
        selectedColor = 0;
    }
    deselectPalette();
}

// Palette.
function selectPalette(event) {
    if (selectedLayer != -1 && selectedColor != -1) {
        layerList.setLayerPalette(selectedLayer, selectedColor, event.target.paletteId,
            redSlider.value, greenSlider.value, blueSlider.value);
        preview.redrawCanvas();
        deselectPalette();
        selectedPalette = event.target;
        event.target.className = 'selectedcolor';
    }
}
function deselectPalette() {
    if (selectedPalette != null) {
        selectedPalette.className = 'color'
        selectedPalette = null;
    }
}

// RGB.
function setRGB(r, g, b) {
    if (selectedLayer != -1) {
        layerList.setLayerRGB(selectedLayer, selectedColor, selectedPalette, r, g, b);
        preview.redrawCanvas();
    }
}

// Spacing and offset.
function increaseField(field, x, y) {
    if (selectedLayer != -1) {
        layerList.increaseLayerValue(selectedLayer, field + 'X', x);
        layerList.increaseLayerValue(selectedLayer, field + 'Y', y);
        preview.redrawCanvas();
    }
}
function resetField(field) {
    if (selectedLayer != -1) {
        layerList.setLayerValue(selectedLayer, field + 'X', 0);
        layerList.setLayerValue(selectedLayer, field + 'Y', 0);
        preview.redrawCanvas();
    }
}

function onLayerSelect(layerId) {
    selectedLayer = parseInt(layerId);
    refreshColorSelector(layerList.getLayerAsset(selectedLayer));
}

// Layer list
function addLayer() {
    if (selectedAsset != null) {
        const layer = layerList.addAssetLayers(selectedAsset, function() {
            selectedLayer = self.id;
        });
        selectLayer(layer);
        preview.redrawCanvas();
    } else {
        console.log('No asset selected.');
    }
}

function deleteLayer() {
    if (selectedLayer != -1) {
        selectLayer(layerList.deleteLayer(selectedLayer))
        preview.redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerUp() {
    if (selectedLayer != -1) {
        if (selectedLayer < layerList.getLastId()) {
            selectLayer(layerList.moveUp(selectedLayer));
            preview.redrawCanvas();
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
            selectLayer(layerList.moveDown(selectedLayer));
            preview.redrawCanvas(); 
        } else {
            console.log('Cannot move bottom layer down.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerTop() {
    if (selectedLayer != -1) {
        if (selectedLayer < layerList.getLastId()) {
            selectLayer(layerList.moveToTop(selectedLayer));
            preview.redrawCanvas();
        } else {
            console.log('Cannot move top layer up.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function moveLayerBottom() {
    if (selectedLayer != -1) {
        if (selectedLayer > 0)  {
            selectLayer(layerList.moveToBottom(selectedLayer));
            preview.redrawCanvas();
        } else {
            console.log('Cannot move bottom layer down.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function duplicateLayer() {
    if (selectedLayer != -1) {
        selectLayer(layerList.duplicateLayer(selectedLayer));
        preview.redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function replaceLayerImg() {
    if (selectedLayer != -1) {
        if (selectedAsset != null) {
            layerList.setLayerAsset(selectedLayer, selectedAsset);
            refreshColorSelector(selectedAsset);
            preview.redrawCanvas();
        } else {
            console.log('No asset selected.');
        }
    } else {
        console.log('No layer selected.');
    }
}

function toggleCell(event) {
    if (selectedLayer != -1) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        layerList.toggleCell(selectedLayer, x, y, canvas.cols, canvas.rows);
        preview.redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function importLayers(file) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        layerList.load(fileReader.result)
    };
    fileReader.readAsText(file);
}

function exportLayers() {
    const file = new Blob([layerList.save()], {type: 'application/json'});
    const downloader = document.createElement('a');
    downloader.href = URL.createObjectURL(file);
    downloader.download = 'pcm_layers';
    downloader.click();
}

function importTemplate(event) {
    const files = event.target.files;
    var settings = null;
    const imgUrl = new Map();
    var nFiles = 0;
    for (let f in files) {
        const name = files[f].name;
        let fileReader = new FileReader();
        if (files[f].type == 'application/json') {
            nFiles++;
            settings = true;
            fileReader.onload = function() {
                settings = JSON.parse(fileReader.result);
                if (settings == null) {
                    console.log('Could not parse settings file ' + name);
                }
                nFiles--;
                if (nFiles == 0) {
                    new Setup().setTemplate(settings, imgUrl);
                }
            };
            fileReader.readAsText(files[f]);
        } else if (files[f].type == 'image/png') {
            nFiles++;
            fileReader.onload = function() {
                imgUrl.set(name.replace('.png', ''), fileReader.result);
                nFiles--;
                if (nFiles == 0) {
                    new Setup().setTemplate(settings, imgUrl);
                }
            }
            fileReader.readAsDataURL(files[f]);
        }
    }
    if (settings == null) {
        console.log('Could not find json settings file.');
        return;
    }
    
}