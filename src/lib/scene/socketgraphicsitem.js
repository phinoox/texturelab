import { GraphicsItem } from "./graphicsitem";
export var SocketType;
(function (SocketType) {
    SocketType[SocketType["In"] = 0] = "In";
    SocketType[SocketType["Out"] = 1] = "Out";
})(SocketType || (SocketType = {}));
export class SocketGraphicsItem extends GraphicsItem {
    constructor() {
        super();
        this.radius = 8;
        // only in sockets store the connection
        // since outsockets can have multiple connections
        //public con:ConnectionGraphicsItem;
        this.conns = new Array();
        this.width = this.radius * 2;
        this.height = this.radius * 2;
    }
    addConnection(con) {
        this.conns.push(con);
    }
    removeConnection(con) {
        this.conns.splice(this.conns.indexOf(con), 1);
    }
    getConnection(index) {
        return this.conns[index];
    }
    // retruns a connection where the outSocket == socketA
    // returns null if no result is found
    getConnectionFrom(socketA) {
        for (let con of this.conns) {
            if (con.socketA == socketA)
                return con;
        }
        return null;
    }
    // retruns a connection where the inSocket == socketB
    // returns null if no result is found
    getConnectionTo(socketB) {
        for (let con of this.conns) {
            if (con.socketB == socketB)
                return con;
        }
        return null;
    }
    hasConnections() {
        return this.conns.length > 0;
    }
    draw(ctx, renderData = null) {
        const renderState = renderData;
        //console.log(this.width);
        ctx.lineWidth = 3;
        //ctx.rect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.fillStyle = "rgb(150,150,150)";
        ctx.arc(this.centerX(), this.centerY(), this.radius, 0, 2 * Math.PI);
        ctx.fill();
        // border
        ctx.beginPath();
        ctx.arc(this.centerX(), this.centerY(), this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.stroke();
        // draw inner dot if connected
        if (this.hasConnections()) {
            //console.log("con");
            ctx.beginPath();
            ctx.fillStyle = "rgb(100,100,100)";
            ctx.arc(this.centerX(), this.centerY(), this.radius / 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        // draw text
        if (renderState.hovered) {
            ctx.fillStyle = "rgb(150,150,150)";
            ctx.font = "9px 'Open Sans'";
            if (this.socketType == SocketType.Out) {
                let w = ctx.measureText(this.title).width;
                ctx.fillText(this.title, this.x + this.width + 4, this.y + 12);
            }
            else {
                let w = ctx.measureText(this.title).width;
                ctx.fillText(this.title, this.x - 4 - w, this.y + 12);
            }
        }
    }
}
//# sourceMappingURL=socketgraphicsitem.js.map