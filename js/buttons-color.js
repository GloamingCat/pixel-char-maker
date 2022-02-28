// Refresh the list of colors of selected asset.
function refreshColorSelector(asset) {
    colorSelector.innerHTML = '';
    colorSelector.value = '0';
    selectedColor = -1;
    if (asset == null || asset.img == null || !paletteSet.getDefaultPalettes(asset)) {
        return;
    }
    let n = paletteSet.getDefaultPalettes(asset).length;
    for (let i = 0; i < n; i++) {
        let option = document.createElement('option');
        option.innerHTML = 'Part ' + (i + 1);
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
        layerList.setLayerPalette(selectedLayer, selectedColor, event.target.paletteId);
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

// RGB sliders.
function changeRGBA(replace, r, g, b, a) {
    if (selectedLayer != -1) {
        layerList.setLayerRGBA(selectedLayer, selectedColor, [r, g, b, a], replace);
        preview.redrawCanvas();
    }
}

// Show/hide color tab.
function showColors() {
    document.getElementById('colors').style.display = 'inline';
    document.getElementById('hide-colors').style.display = 'inline';
    document.getElementById('show-colors').style.display = 'none';
}
function hideColors() {
    document.getElementById('colors').style.display = 'none';
    document.getElementById('hide-colors').style.display = 'none';
    document.getElementById('show-colors').style.display = 'inline';
}

// Switch RGBA type.
function switchToSliders() {
    document.getElementById('color-sliders').style.display = 'grid';
    document.getElementById('color-buttons').style.display = 'none';
    document.getElementById('switch-to-buttons').style.display = 'inline';
    document.getElementById('switch-to-sliders').style.display = 'none';
}
function switchToButtons() {
    document.getElementById('color-buttons').style.display = 'grid';
    document.getElementById('color-sliders').style.display = 'none';
    document.getElementById('switch-to-sliders').style.display = 'inline';
    document.getElementById('switch-to-buttons').style.display = 'none';
}