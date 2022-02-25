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
        console.log(palette);
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
    let clothCanvas = document.createElement('canvas');
    clothCanvas.width = img.width;
    clothCanvas.height = img.height;
    let clothCtx = clothCanvas.getContext('2d');
    clothCtx.drawImage(img, 0, 0);
    let imgData = clothCtx.getImageData(0, 0, clothCanvas.width, clothCanvas.height);
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

function addCloth(name, path, folderDiv) {
    const img = new Image();
    img.src = path + name + '.png';
    const cloth = document.createElement('img');
    cloth.src = img.src;
    cloth.className = 'cloth'
    cloth.id = name;
    cloth.addEventListener('click', function(event) {
        selectCloth(cloth, img);
    });
    cloth.onload = function() {
        console.log(name);
        colorLists.set(img, createColorList(img));
        if (name == 'Body') {
            refreshColorSelector(img);
        }
    }
    folderDiv.append(cloth);
    return img;
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
    for (i in folder.clothes) {
        let clothImg = addCloth(folder.clothes[i], path, folderDiv);
        if (folder.name == 'Body' && i == 0) {
            clothImg.onload = redrawCanvas;
            selectFolder(folderDiv);
            selectCloth(folderDiv.firstElementChild, clothImg);
        }
    }
    return folderDiv;
}

const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
    var settings = JSON.parse(this.responseText);
    canvas.width = settings.width;
    canvas.height = settings.height;
    paletteImg = new Image();
    paletteImg.src = settings.paletteFile;
    paletteImg.onload = function() {
        loadPalettes(paletteImg);
        const path = 'templates/' + settings.template + '/'
        for (f in settings.folders) {
            addFolder(settings.folders[f], path);
        }
        addLayer();
    }
};
xmlhttp.open("GET", "settings.json");
xmlhttp.send();

