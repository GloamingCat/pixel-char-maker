
// HTML Elements

var folderButtons = document.getElementById('folderButtons');
var folderStack = document.getElementById('folderStack');
var layerSelector = document.getElementById('layerSelector');
var colorSelector = document.getElementById('colorSelector');
var paletteButtons = document.getElementById('palettes');
var canvas = document.getElementById('spritesheet');
var ctx = canvas.getContext('2d');

// Settings

var palettes = [];
var colorLists = new Map();

// State

var layers = [];
var selectedFolder = null;
var selectedCloth = null;
var selectedLayer = -1;
var selectedColor = 0;
var selectedPalette = null;
