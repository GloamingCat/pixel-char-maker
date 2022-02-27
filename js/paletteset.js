class PaletteSet {

    constructor() {
        this.palettes = [];
        this.colorLists = new Map();
    }

    load(img) {
        const imgCanvas = document.createElement('canvas');
        imgCanvas.width = img.width;
        imgCanvas.height = img.height;
        const ctx = imgCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const paletteButtons = document.getElementById("palettes");
        for (let i = 0; i < img.width; i++) {
            var palette = []
            for (let j = 0; j < img.height; j++) {
                let k = (j * img.width + i)*4;
                palette.push([imgData.data[k], imgData.data[k + 1], imgData.data[k + 2]]);
            }
            this.palettes.push(palette);
            const button = document.createElement('img');
            let middle = palette[Math.ceil(palette.length / 2)];
            button.paletteId = i;
            button.className = 'color';
            button.style.backgroundColor = 'rgb(' + middle.join(',') + ')';
            button.addEventListener('click', selectPalette);
            paletteButtons.append(button);
        }
    }

    findPalette(pixel) {
        for (let p in this.palettes) {
            for (let t in this.palettes[p]) {
                let tone = this.palettes[p][t]
                if (tone[0] == pixel[0] && tone[1] == pixel[1] && tone[2] == pixel[2]) {
                    return p;
                }
            }
        }
        return null;
    }

    createColorList(img) {
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
            let palette = this.findPalette(pixel);
            if (palette != null) {
                colorSet.add(palette);
            }
        }
        return [...colorSet];
    }

    get(id, asset) {
        if (asset == null)
            return this.palettes[id];
        else
            return this.palettes[this.getDefaultPalettes(asset)[id]];
    }

    getDefaultPalettes(asset) {
        return this.colorLists.get(asset);
    }

    addDefaultPalettes(asset, img) {
        this.colorLists.set(asset, this.createColorList(img));
    }

}