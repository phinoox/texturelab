export class ImageCanvas {
    constructor(width = 1024, height = 1024) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    }
    // copies image from source
    // scales the image to fit dest canvas
    copyFromCanvas(canvas) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(canvas, 0, 0, this.canvas.width, this.canvas.height);
    }
    copyFromImageCanvas(imageCanvas) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(imageCanvas.canvas, 0, 0, this.canvas.width, this.canvas.height);
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    width() {
        return this.canvas.width;
    }
    height() {
        return this.canvas.height;
    }
    toImage() {
        var img = (document.createElement("image"));
        //var img:HTMLImageElement = new Image(this.width, this.height);
        img.src = this.canvas.toDataURL("image/png");
        return img;
    }
    createTexture(gl) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);
        return texture;
    }
}
//# sourceMappingURL=imagecanvas.js.map