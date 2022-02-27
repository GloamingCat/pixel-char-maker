
// Canvas
function redrawCanvas() {
    var maxW = 0;
    var maxH = 0;
    for(l in layers) {
        maxW = Math.max(maxW, layers[l].asset.img.width + layers[l].spaceX * 2 * canvas.cols);
        maxH = Math.max(maxH, layers[l].asset.img.height + layers[l].spaceY * 2 * canvas.rows);
    }
    canvas.width = maxW;
    canvas.height = maxH;
    if (maxW > 0 && maxH > 0) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, maxW, maxH);
        for(l in layers) {
            layers[l].draw(canvas.cols, canvas.rows, ctx);
        }
    }
    window.localStorage.setItem("pcm_layers", saveLayers());
}
function redrawAnim() {
    if (lastFrame >= animPattern.length) {
        lastFrame = 0;
        lastRow += 1;
        if (lastRow >= canvas.rows) {
            lastRow = 0;
        }
    }
    if (canvas.width > 0 && canvas.height > 0) {
        var w = canvas.width / canvas.cols;
        var h = canvas.height / canvas.rows;
        anim.width = w * 2;
        anim.height = canvas.height;
        var ctx = anim.getContext('2d');
        ctx.clearRect(0, 0, anim.width, anim.height);
        ctx.drawImage(canvas, w * animPattern[lastFrame], 0, w, canvas.height, 0, 0, w, canvas.height);
        ctx.drawImage(canvas, w * animPattern[lastFrame], h * lastRow, w, h, w, 0, w, h);
    }
    lastFrame += 1;
    if (animInterval > 0) {
        setTimeout(redrawAnim, animInterval);
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
    if (asset.img == null || !colorLists.has(asset)) {
        return;
    }
    let n = colorLists.get(asset).length;
    for (i = 0; i < n; i++) {
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
    redSlider.value = 100;
    greenSlider.value = 100;
    blueSlider.value = 100;
}

// Palette.
function selectPalette(event) {
    if (selectedLayer != -1 && selectedColor != -1) {
        layers[selectedLayer].setPalette(selectedColor, event.target.paletteId);
        layers[selectedLayer].setRGB(selectedColor, event.target.paletteId,
            redSlider.value, greenSlider.value, blueSlider.value
        );
        redrawCanvas();
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
        if (selectedPalette == null) {
            layers[selectedLayer].setRGB(selectedColor, -1, r, g, b);
        } else {
            layers[selectedLayer].setRGB(selectedColor, selectedPalette.paletteId, r, g, b);
        }
        redrawCanvas();
        if (r != null) redSlider.value = r;
        if (g != null) greenSlider.value = g;
        if (b != null) blueSlider.value = b;
    }
}

// Offset.
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

// Spacing.
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

// Layer list
function addLayer() {
    if (selectedAsset != null) {
        let layer = new Layer(selectedAsset, false);
        if (selectedAsset.back != null) {
            let backLayer = new Layer(selectedAsset, true);
            backLayer.moveToBottom();
        }
        selectLayer(layer);
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
            layers[selectedLayer].asset = selectedAsset;
            layers[selectedLayer].refreshOption();
            refreshColorSelector(selectedAsset);
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

function toggleCell(event) {
    if (selectedLayer != -1) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const w = layers[selectedLayer].asset.img.width / canvas.cols + layers[l].spaceX * 2
        const h = layers[selectedLayer].asset.img.height / canvas.rows + layers[l].spaceY * 2
        const key = Math.floor(y / h) + "_" + Math.floor(x / w);
        if (layers[selectedLayer].hidden.has(key)) {
            layers[selectedLayer].hidden.delete(key);
        } else {
            layers[selectedLayer].hidden.add(key);
        }
        redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function importLayers(file) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        loadLayers(fileReader.result)
    };
    fileReader.readAsText(file);
}

function exportLayers() {
    const file = new Blob([saveLayers()], {type: 'application/json'});
    const downloader = document.createElement("a");
    downloader.href = URL.createObjectURL(file);
    downloader.download = 'pcm_layers';
    downloader.click();
}

function loadTemplate(event) {
    const files = event.target.files;
    var settings = null;
    const imgUrl = new Map();
    var nFiles = 0;
    for (f in files) {
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
                    resetGlobals();
                    setup(settings, imgUrl);
                }
            };
            fileReader.readAsText(files[f]);
        } else if (files[f].type == 'image/png') {
            nFiles++;
            fileReader.onload = function() {
                imgUrl.set(name.replace('.png', ''), fileReader.result);
                nFiles--;
                if (nFiles == 0) {
                    resetGlobals();
                    setup(settings, imgUrl);
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