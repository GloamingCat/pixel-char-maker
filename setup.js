
// Elements

var folderButtons = document.getElementById('folderButtons');
var folderStack = document.getElementById('folderStack');
var paletteButton = document.getElementById('palettes');
paletteButton.addEventListener('click', function(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    selectPalette(Math.floor(x / 10));
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
        console.log(palette);
    }
    paletteButton.width = paletteImg.width * 10;
    paletteButton.height = paletteImg.height * 10;
};

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
            setColorIds(img);
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

