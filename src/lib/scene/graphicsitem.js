export class GraphicsItem {
    constructor() {
        this.visible = true;
        this.x = 0;
        this.y = 0;
        //this.scene = scene;
        //scene.addItem(this);
        this.width = 1;
        this.height = 1;
    }
    isPointInside(px, py) {
        if (px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height)
            return true;
        return false;
    }
    setCenter(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
    centerX() {
        return this.x + this.width / 2;
    }
    centerY() {
        return this.y + this.height / 2;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    // to be overriden
    draw(ctx, renderData = null) { }
}
//# sourceMappingURL=graphicsitem.js.map