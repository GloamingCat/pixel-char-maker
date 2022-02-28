// Spacing and offset.
function increaseField(field, x, y) {
    if (allLayersBox.checked) {
        layerList.increaseLayerValue(-1, field + 'X', x);
        layerList.increaseLayerValue(-1, field + 'Y', y);
        preview.redrawCanvas();
    } else if (selectedLayer != -1) {
        layerList.increaseLayerValue(selectedLayer, field + 'X', x);
        layerList.increaseLayerValue(selectedLayer, field + 'Y', y);
        preview.redrawCanvas();
    }
}
function resetField(field) {
    if (allLayersBox.checked) {
        layerList.setLayerValue(-1, field + 'X', 0);
        layerList.setLayerValue(-1, field + 'Y', 0);
        preview.redrawCanvas();
    } else if (selectedLayer != -1) {
        layerList.setLayerValue(selectedLayer, field + 'X', 0);
        layerList.setLayerValue(selectedLayer, field + 'Y', 0);
        preview.redrawCanvas();
    }
}
function flipCells() {
    if (allLayersBox.checked) {
        layerList.invertLayerValue(-1, 'flip');
        preview.redrawCanvas();
    } else if (selectedLayer != -1) {
        layerList.invertLayerValue(selectedLayer, 'flip');
        preview.redrawCanvas();
    }
}

// Show/hide transform tab.
function showTransform() {
    document.getElementById('transform').style.display = 'inline';
    document.getElementById('hideTransform').style.display = 'inline';
    document.getElementById('showTransform').style.display = 'none';
}

function hideTransform() {
    document.getElementById('transform').style.display = 'none';
    document.getElementById('hideTransform').style.display = 'none';
    document.getElementById('showTransform').style.display = 'inline';
}