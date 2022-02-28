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
