
// Elements

var folderButtons = document.getElementById('folderButtons');
var folderStack = document.getElementById('folderStack');
var palettes = document.getElementById('palettes');

palettes.addEventListener('click', function(event) {
    var p = event.layerX / 10;
    if (selectedLayer != -1) {
        layers[selectedLayer].palette = p;
        redrawCanvas();
    }
});

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
    palettes.width = settings.nPalettes * 10;
    palettes.height = settings.nTones * 10;
    const path = 'templates/' + settings.template + '/'
    for (f in settings.folders) {
        addFolder(settings.folders[f], path);
    }
    addLayer();
};
xmlhttp.open("GET", "settings.json");
xmlhttp.send();

