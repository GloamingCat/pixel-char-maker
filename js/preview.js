class Preview {

    constructor() {
        this.lastRow = 0;
        this.lastFrame = 0;
        this.interval = 0;
        this.pattern = [];
        this.timeoutId = null;
        this.speedLevels = [0.25, 0.5, 0.75, 1, 1.5, 2, 4];
        this.speed = 3;
    }

    increaseSpeed() {
        if (this.speed < this.speedLevels.length - 1) {
            this.stopAnim();
            this.speed++;
            this.startAnim();
        }
    }

    decreaseSpeed() {
        if (this.speed > 0) {
            this.stopAnim();
            this.speed--;
            this.startAnim();
        }
    }

    setAnim(interval, pattern) {
        this.stopAnim();
        this.interval = interval;
        this.pattern = pattern;
        this.startAnim();
    }

    // Canvas
    redrawCanvas() {
        canvas.width = layerList.getMaxWidth(canvas.cols);
        canvas.height = layerList.getMaxHeight(canvas.rows);
        if (canvas.width > 0 && canvas.height > 0) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            layerList.draw(canvas.cols, canvas.rows, ctx);
        }
        layerList.store();
    }

    redrawAnim() {
        if (this.lastFrame >= this.pattern.length) {
            this.lastFrame = 0;
            this.lastRow++;
            if (this.lastRow >= canvas.rows) {
                this.lastRow = 0;
            }
        }
        if (canvas.width > 0 && canvas.height > 0) {
            var w = canvas.width / canvas.cols;
            var h = canvas.height / canvas.rows;
            anim.width = w * 2;
            anim.height = canvas.height;
            var ctx = anim.getContext('2d');
            ctx.clearRect(0, 0, anim.width, anim.height);
            ctx.drawImage(canvas, w * this.pattern[this.lastFrame], 0, w, canvas.height, 0, 0, w, canvas.height);
            ctx.drawImage(canvas, w * this.pattern[this.lastFrame], h * this.lastRow, w, h, w, 0, w, h);
        } else {
            anim.width = 0;
            anim.height = 0;
        }
        this.lastFrame++;
        this.startAnim();
    }

    startAnim() {
        if (this.interval > 0) {
            this.timeoutId = setTimeout(this.redrawAnim.bind(this), this.interval / this.speedLevels[this.speed]);
        }
    }

    stopAnim() {
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    refresh() {
        this.stopAnim();
        this.speed = 3;
        this.redrawCanvas();
        this.startAnim();
    }

}