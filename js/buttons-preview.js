
function toggleCell(event) {
    if (selectedLayer != -1) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        layerList.toggleCell(selectedLayer, x, y, canvas.cols, canvas.rows);
        preview.redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function showAllCells() {
    if (selectedLayer != -1) {
        layerList.showCells(selectedLayer);
        preview.redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function hideAllCells() {
    if (selectedLayer != -1) {
        layerList.hideCells(selectedLayer, canvas.cols, canvas.rows);
        preview.redrawCanvas();
    } else {
        console.log('No layer selected.');
    }
}

function exportSpritesheet() {
    const downloader = document.createElement('a');
    downloader.href = canvas.toDataURL();
    downloader.download = 'pcm_spritesheet.png';
    downloader.click();
}