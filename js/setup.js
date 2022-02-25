
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    canvasClick(x, y);
});

function loadPalettes(paletteImg) {
    let canvas = document.createElement('canvas');
    canvas.width = paletteImg.width;
    canvas.height = paletteImg.height;
    let ctx =  canvas.getContext('2d');
    ctx.drawImage(paletteImg, 0, 0);
    let imgData = ctx.getImageData(0, 0, paletteImg.width, paletteImg.height);
    for (i = 0; i < paletteImg.width; i++) {
        var palette = []
        for (j = 0; j < paletteImg.height; j++) {
            let k = (j * paletteImg.width + i)*4;
            palette.push([imgData.data[k], imgData.data[k + 1], imgData.data[k + 2]]);
        }
        palettes.push(palette);
        const p = i;
        const button = document.createElement('img');
        let middle = palette[Math.ceil(palette.length / 2)];
        button.className = 'color';
        button.style.backgroundColor = 'rgb(' + middle.join(',') + ')';
        button.addEventListener('click', function(event) {
            selectPalette(p, button);
        });
        paletteButtons.append(button);
    }
};

function findPalette(pixel) {
    for (p in palettes) {
        for (t in palettes[p]) {
            let tone = palettes[p][t]
            if (tone[0] == pixel[0] && tone[1] == pixel[1] && tone[2] == pixel[2]) {
                return p;
            }
        }
    }
    return null;
}

function createColorList(img) {
    var colorSet = new Set();
    let paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = img.width;
    paletteCanvas.height = img.height;
    let paletteCtx = paletteCanvas.getContext('2d');
    paletteCtx.drawImage(img, 0, 0);
    let imgData = paletteCtx.getImageData(0, 0, paletteCanvas.width, paletteCanvas.height);
    let data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
        let pixel = [data[i], data[i + 1], data[i + 2]];
        let palette = findPalette(pixel);
        if (palette != null) {
            colorSet.add(p);
        }
    }
    return [...colorSet];
}

function addAsset(name, path, folderDiv) {
    var back = false;
    if (name.includes('_back')) {
        name = name.replace('_back', '');
        back = true;
    }
    const asset = document.createElement('img');
    asset.id = name;
    asset.className = 'asset'
    asset.src = path + name + '.png';
    asset.img = new Image();
    asset.img.src = asset.src;
    if (back) {
        asset.back = new Image();
        asset.back.src = path + name + '_back.png';
    }
    asset.addEventListener('click', function(event) {
        selectAsset(asset);
    });
    asset.img.onload = function() {
        colorLists.set(asset, createColorList(asset.img));
        if (name == 'Body') {
            refreshColorSelector(asset);
        }
    }
    folderDiv.append(asset);
    return asset;
}

function addFolder(folder, path) {
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';
    folderStack.append(folderDiv);
    const folderButton = document.createElement('button');
    folderButton.innerHTML = folder.name;
    folderButton.addEventListener('click', function(event) {
        selectFolder(folderDiv);
    });
    folderButtons.append(folderButton);
    for (i in folder.assets) {
        let asset = addAsset(folder.assets[i], path, folderDiv);
        if (i == 0) {
            if (folder.name == 'Body') {
                asset.onload = redrawCanvas;
                selectFolder(folderDiv);
                selectAsset(folderDiv.firstElementChild);
            }
            folderButton.addEventListener('click', function(event) {
                selectAsset(folderDiv.firstElementChild);
            });
        }
    }
    return folderDiv;
}

const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
    var settings = JSON.parse(this.responseText);
    const path = 'templates/' + settings.template + '/';
    canvas.width = settings.width;
    canvas.height = settings.height;
    canvas.rows = settings.rows;
    canvas.cols = settings.cols;
    paletteImg = new Image();
    paletteImg.src = path + settings.paletteFile;
    paletteImg.onload = function() {
        loadPalettes(paletteImg);
        for (f in settings.folders) {
            addFolder(settings.folders[f], path);
        }
        addLayer();
    }
};
xmlhttp.open('GET', 'settings-lth.json');
xmlhttp.send();

