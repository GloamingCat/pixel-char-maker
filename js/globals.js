
// HTML Elements

var folderButtons = document.getElementById('folderButtons');
var folderStack = document.getElementById('folderStack');
var layerSelector = document.getElementById('layerSelector');
var colorSelector = document.getElementById('colorSelector');
var paletteButtons = document.getElementById('palettes');
var redSlider = document.getElementById('redSlider');
var greenSlider = document.getElementById('greenSlider');
var blueSlider = document.getElementById('blueSlider');
var canvas = document.getElementById('spritesheet');
var anim = document.getElementById('animation');

// Settings

var palettes = [];
var colorLists = new Map();

// State

var layers = [];
var selectedFolder = null;
var selectedAsset = null;
var selectedLayer = -1;
var selectedColor = -1;
var selectedPalette = null;

// Animations

var lastFrame = 0;
var animInterval = 0;
var animPattern = [];

function resetGlobals() {
    folderStack.innerHTML = '';
    folderButtons.innerHTML = 'Folders:';
    layerSelector.innerHTML = '';
    colorSelector.innerHTML = '';
    paletteButtons.innerHTML = '';
    palettes = [];
    colorLists = new Map();
    layers = [];
    selectedFolder = null;
    selectedAsset = null;
    selectedLayer = -1;
    selectedColor = -1;
    selectedPalette = null;
    lastFrame = 0;
    animInterval = 0;
}