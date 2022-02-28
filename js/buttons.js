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