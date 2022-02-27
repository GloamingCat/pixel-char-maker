class Setup {

    loadDefault(name) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
            const settings = JSON.parse(xmlhttp.responseText);
            this.setTemplate(settings, './templates/' + name + '/');
        }.bind(this);
        xmlhttp.open('GET', './templates/' + name + '/settings.json');
        xmlhttp.send();
    }

    setTemplate(settings, path) {
        resetGlobals();
        canvas.width = settings.width;
        canvas.height = settings.height;
        canvas.rows = settings.rows;
        canvas.cols = settings.cols;
        const paletteImg = new Image();
        if (typeof(path) != 'string') {
            paletteImg.src = path.get(settings.paletteFile);
        } else {
            paletteImg.src += path + settings.paletteFile + '.png';
        }
        paletteImg.onload = function() {
            paletteSet.load(paletteImg);
            for (let f in settings.folders) {
                let folderDiv = this.addFolder(settings.folders[f], path);
                if (f == 0) {
                    selectFolder(folderDiv);
                    selectAsset(folderDiv.firstElementChild);
                }
            }
            const cache = window.localStorage.getItem("pcm_layers");
            if (cache != null) {
                layerList.load(cache);
                preview.redrawCanvas();
            } else {
                addLayer();
            }
            layerList.setOnLoad(function() {
                preview.redrawCanvas()
            });
        }.bind(this);
        preview.setAnim(settings.interval, settings.animation);
    }

    addFolder(folder, path) {
        // Create folder button
        const folderStack = document.getElementById('folderStack');
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder';
        folderStack.append(folderDiv);
        const folderButton = document.createElement('button');
        folderButton.innerHTML = folder.name;
        folderButton.addEventListener('click', function(event) {
            selectFolder(folderDiv);
        });
        folderButtons.append(folderButton);
        // Add asset buttons in the folder
        for (let i in folder.assets) {
            let asset = this.addAsset(folder.assets[i], path, folderDiv);
            if (i == 0) {
                folderButton.addEventListener('click', function(event) {
                    selectAsset(folderDiv.firstElementChild);
                });
            }
        }
        return folderDiv;
    }

    addAsset(name, path, folderDiv) {
        var back = false;
        if (name.includes('_back')) {
            name = name.replace('_back', '');
            back = true;
        }
        // Get path
        if (typeof(path) != 'string') {
            path = path.get(name);
        } else {
            path += name + '.png';
        }
        // Create asset button
        const asset = document.createElement('img');
        asset.id = name;
        asset.className = 'asset'
        asset.src = path;
        asset.addEventListener('click', function() {
            selectAsset(asset);
        });
        folderDiv.append(asset);
        // Load all images
        asset.img = new Image();
        asset.img.src = asset.src;
        asset.img.onload = function() {
            paletteSet.addDefaultPalettes(asset, asset.img);
            if (name == 'Body') {
                refreshColorSelector(asset);
            }
        }
        if (back) {
            asset.back = new Image();
            asset.back.src = path.replace('.png', '_back.png');
        }
        return asset;
    }

}