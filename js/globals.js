
// HTML Elements

var folderButtons = document.getElementById('folderButtons');
var folderStack = document.getElementById('folderStack');
var layerSelector = document.getElementById('layerSelector');
var colorSelector = document.getElementById('colorSelector');
var paletteButtons = document.getElementById('palettes');
var redSlider = document.getElementById('red-slider');
var greenSlider = document.getElementById('green-slider');
var blueSlider = document.getElementById('blue-slider');
var alphaSlider = document.getElementById('alpha-slider');
var allLayersBox = document.getElementById('allLayers');
var canvas = document.getElementById('spritesheet');
var anim = document.getElementById('animation');

// State

var preview;
var paletteSet;
var layerList;
var selectedFolder;
var selectedAsset;
var selectedLayer;
var selectedColor;
var selectedPalette;

function resetGlobals() {
    folderStack.innerHTML = '';
    folderButtons.innerHTML = 'Folders:';
    layerSelector.innerHTML = '';
    colorSelector.innerHTML = '';
    paletteButtons.innerHTML = '';
    paletteSet = new PaletteSet();
    layerList = new LayerList();
    if (preview != null)
        preview.stopAnim();
    preview = new Preview();
    selectedFolder = null;
    selectedAsset = null;
    selectedLayer = -1;
    selectedColor = -1;
    selectedPalette = null;
    lastFrame = 0;
    lastRow = 0;
    animInterval = 0;
}
