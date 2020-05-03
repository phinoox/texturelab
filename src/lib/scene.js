import { NodeGraphicsItem } from "./scene/nodegraphicsitem";
import { ConnectionGraphicsItem } from "./scene/connectiongraphicsitem";
import { SocketType } from "./scene/socketgraphicsitem";
import { SceneView } from "./scene/view";
export class NodeScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.view = new SceneView(canvas);
        this.hasFocus = false;
        this.contextExtra = this.context;
        this.nodes = new Array();
        this.conns = new Array();
        // bind event listeners
        var self = this;
        canvas.addEventListener("mousemove", function (evt) {
            self.onMouseMove(evt);
        });
        canvas.addEventListener("mousedown", function (evt) {
            self.onMouseDown(evt);
        });
        canvas.addEventListener("mouseup", function (evt) {
            self.onMouseUp(evt);
        });
        window.addEventListener("click", function (evt) {
            //console.log(evt.target == canvas);
            if (evt.target == canvas) {
                self.hasFocus = true;
            }
            else {
                self.hasFocus = false;
            }
        });
        window.addEventListener("keydown", function (evt) {
            if (evt.key == "Delete" && self.hasFocus && self.selectedNode) {
                self.deleteNode(self.selectedNode);
            }
        }, true);
        // canvas.addEventListener("mousewheel", function(evt: WheelEvent) {
        //   self.onMouseScroll(evt);
        // });
        canvas.addEventListener("contextmenu", function (evt) {
            evt.preventDefault();
        });
    }
    getHitItem(x, y) {
        return null;
    }
    addNode(item) {
        this.nodes.push(item);
    }
    deleteNode(item) {
        // delete connections
        let conns = this.conns;
        for (let i = this.conns.length - 1; i >= 0; i--) {
            let con = this.conns[i];
            if ((con.socketA && con.socketA.node.id == item.id) ||
                (con.socketB && con.socketB.node.id == item.id)) {
                this.removeConnection(con);
            }
        }
        // remove node from list
        this.nodes.splice(this.nodes.indexOf(item), 1);
        // if node is selected (which it most likely is), clear it from selection
        this.selectedNode = null;
        // emit deselection
        if (this.onnodeselected)
            this.onnodeselected(null);
        // emit remove event
        if (this.onnodedeleted)
            this.onnodedeleted(item);
    }
    getNodeById(id) {
        for (let node of this.nodes) {
            if (node.id == id)
                return node;
        }
        return null;
    }
    //todo: integrity check
    addConnection(con) {
        this.conns.push(con);
        // link the sockets
        con.socketA.addConnection(con);
        con.socketB.addConnection(con);
        // callback
        if (this.onconnectioncreated)
            this.onconnectioncreated(con);
    }
    createConnection(leftId, rightId, rightIndex = 0) {
        var con = new ConnectionGraphicsItem();
        // get nodes
        var leftNode = this.getNodeById(leftId);
        var rightNode = this.getNodeById(rightId);
        // get sockets
        con.socketA = leftNode.sockets.find(x => x.socketType == SocketType.Out);
        con.socketB = rightNode.sockets[rightIndex];
        this.addConnection(con);
    }
    removeConnection(con) {
        console.log("removing connection in scene");
        console.log(con);
        this.conns.splice(this.conns.indexOf(con), 1);
        //con.socketA.con = null;
        //con.socketB.con = null;
        con.socketA.removeConnection(con);
        con.socketB.removeConnection(con);
        // callback
        if (this.onconnectiondestroyed)
            this.onconnectiondestroyed(con);
    }
    // if the user click drags on a socket then it's making a connection
    drawActiveConnection() {
        let mouse = this.view.getMouseSceneSpace();
        let mouseX = mouse.x;
        let mouseY = mouse.y;
        let ctx = this.context;
        if (this.hitSocket) {
            ctx.beginPath();
            ctx.strokeStyle = "rgb(200, 200, 200)";
            ctx.lineWidth = 4;
            ctx.moveTo(this.hitSocket.centerX(), this.hitSocket.centerY());
            if (this.hitSocket.socketType == SocketType.Out) {
                ctx.bezierCurveTo(this.hitSocket.centerX() + 60, this.hitSocket.centerY(), // control point 1
                mouseX - 60, mouseY, mouseX, mouseY);
            }
            else {
                ctx.bezierCurveTo(this.hitSocket.centerX() - 60, this.hitSocket.centerY(), // control point 1
                mouseX + 60, mouseY, mouseX, mouseY);
            }
            ctx.setLineDash([5, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.fillStyle = "rgb(200, 200, 200)";
            const radius = 6;
            ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    clearAndDrawGrid() {
        //this.context.scale(2,2);
        // this.context.fillStyle = "rgb(120, 120, 120)";
        // var topCorner = this.view.canvasToSceneXY(0, 0);
        // var bottomCorner = this.view.canvasToSceneXY(
        //   this.canvas.clientWidth,
        //   this.canvas.clientHeight
        // );
        // this.context.fillRect(
        //   topCorner.x,
        //   topCorner.y,
        //   bottomCorner.x - topCorner.x,
        //   bottomCorner.y - topCorner.y
        // );
        //this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
        // todo: draw grid
        this.view.clear(this.context, "#4A5050");
        this.view.setViewMatrix(this.context);
        this.view.drawGrid(this.context, 33.33333, "#4E5454", 1);
        this.view.drawGrid(this.context, 100, "#464C4C", 3);
    }
    draw() {
        this.clearAndDrawGrid();
        // draw connections
        for (let con of this.conns) {
            if (con == this.hitConnection)
                continue;
            con.draw(this.context);
        }
        if (this.hitSocket) {
            this.drawActiveConnection();
        }
        // draw nodes
        let mouse = this.view.getMouseSceneSpace();
        let mouseX = mouse.x;
        let mouseY = mouse.y;
        let nodeState = {
            hovered: false,
            selected: false // selected node
        };
        for (let item of this.nodes) {
            // check for selection ( only do this when not dragging anything )
            if (item == this.selectedNode)
                nodeState.selected = true;
            else
                nodeState.selected = false;
            // check for hover
            if (item.isPointInside(mouseX, mouseY) && this.hitSocket == null)
                nodeState.hovered = true;
            else
                nodeState.hovered = false;
            item.draw(this.context, nodeState);
        }
    }
    // mouse events
    onMouseDown(evt) {
        var pos = this.getScenePos(evt);
        let mouseX = pos.x;
        let mouseY = pos.y;
        if (evt.button == 0) {
            // check for a hit socket first
            let hitSock = this.getHitSocket(mouseX, mouseY);
            if (hitSock) {
                // if socket is an in socket with a connection, make hitsocket the connected out socket
                if (hitSock.socketType == SocketType.In && hitSock.hasConnections()) {
                    this.hitSocket = hitSock.getConnection(0).socketA; // insockets should only have one connection
                    // store connection for removal as well
                    this.hitConnection = hitSock.getConnection(0);
                }
                else
                    this.hitSocket = hitSock;
            }
            else {
                // if there isnt a hit socket then check for a hit node
                let hitNode = this.getHitNode(mouseX, mouseY);
                if (hitNode) {
                    //move node to stop of stack
                    this.moveNodeToTop(hitNode);
                    // todo: do this properly on mouse release
                    this.selectedNode = hitNode;
                }
                else {
                    this.selectedNode = null;
                }
                this.draggedNode = hitNode;
                if (this.onnodeselected) {
                    if (hitNode)
                        this.onnodeselected(hitNode);
                    else
                        this.onnodeselected(hitNode);
                }
            }
        }
    }
    // https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    moveNodeToTop(node) {
        var index = this.nodes.indexOf(node);
        if (index === -1) {
            console.log("Attempting to push node that doesnt exist in node list");
        }
        this.nodes.splice(index, 1);
        this.nodes.push(node);
    }
    onMouseUp(evt) {
        var pos = this.getScenePos(evt);
        let mouseX = pos.x;
        let mouseY = pos.y;
        if (evt.button == 0) {
            if (this.hitSocket) {
                // remove previous connection
                // this block creates a new connection regardless of the outcome
                if (this.hitConnection) {
                    this.removeConnection(this.hitConnection);
                    this.hitConnection = null;
                }
                let closeSock = this.getHitSocket(mouseX, mouseY);
                if (closeSock &&
                    closeSock != this.hitSocket &&
                    closeSock.socketType != this.hitSocket.socketType &&
                    closeSock.node != this.hitSocket.node) {
                    // close socket
                    var con = new ConnectionGraphicsItem();
                    // out socket should be on the left, socketA
                    if (this.hitSocket.socketType == SocketType.Out) {
                        // out socket
                        con.socketA = this.hitSocket;
                        con.socketB = closeSock;
                        // close sock is an inSocket which means it should only have one connection
                        // remove current connection from inSocket
                        if (closeSock.hasConnections())
                            this.removeConnection(closeSock.getConnection(0));
                    }
                    else {
                        // in socket
                        con.socketA = closeSock;
                        con.socketB = this.hitSocket;
                    }
                    // link connection
                    //con.socketA.con = con;
                    //con.socketB.con = con;
                    this.addConnection(con);
                }
                else if (!closeSock) {
                    // delete connection if hit node is an insock
                    // if we're here it means one of 2 things:
                    // 1: a new connection failed to form
                    // 2: we're breaking a previously formed connection, which can only be done
                    // by dragging from an insock that already has a connection
                    if (this.hitSocket.socketType == SocketType.Out) {
                        /*
                                    if (this.hitSocket.hasConnections()) {
                                        // remove connection
                                        //let con = this.hitSocket.con;
                                        this.removeConnection(this.hitSocket.getConnectionFrom(this.hitSocket));
                                    }
                                    */
                        if (this.hitConnection)
                            this.removeConnection(this.hitConnection);
                    }
                }
            }
            this.draggedNode = null;
            this.hitSocket = null;
            this.hitConnection = null;
        }
    }
    onMouseMove(evt) {
        var pos = this.getScenePos(evt);
        // handle dragged socket
        if (this.hitSocket) {
        }
        // handle dragged node
        if (this.draggedNode != null) {
            //var diff = this.view.canvasToSceneXY(evt.movementX, evt.movementY);
            //console.log("move: ",evt.movementX,evt.movementY);
            //this.draggedNode.move(evt.movementX, evt.movementY);
            // view keeps track of dragging
            let drag = this.view.getMouseDeltaSceneSpace();
            this.draggedNode.move(drag.x, drag.y);
        }
    }
    // hit detection
    // x and y are scene space
    getHitNode(x, y) {
        // for (let node of this.nodes) {
        for (var index = this.nodes.length - 1; index >= 0; index--) {
            let node = this.nodes[index];
            if (node.isPointInside(x, y))
                return node;
        }
        return null;
    }
    getHitSocket(x, y) {
        // todo: sort items from front to back
        for (let node of this.nodes) {
            for (let sock of node.sockets) {
                if (sock.isPointInside(x, y))
                    return sock;
            }
        }
        return null;
    }
    // UTILITY
    // returns the scene pos from the mouse event
    getScenePos(evt) {
        var canvasPos = _getMousePos(this.canvas, evt);
        return this.view.canvasToSceneXY(canvasPos.x, canvasPos.y);
    }
    // SAVE/LOAD
    // only save position data to associative array
    save() {
        var data = {};
        var nodes = {};
        for (let node of this.nodes) {
            var n = {};
            n["id"] = node.id;
            n["x"] = node.centerX();
            n["y"] = node.centerY();
            nodes[node.id] = n;
        }
        data["nodes"] = nodes;
        return data;
    }
    static load(designer, data, canvas) {
        var s = new NodeScene(canvas);
        // add nodes one by one
        for (let dNode of designer.nodes) {
            // create node from designer
            var node = new NodeGraphicsItem(dNode.title);
            for (let input of dNode.getInputs()) {
                node.addSocket(input, input, SocketType.In);
            }
            node.addSocket("output", "output", SocketType.Out);
            s.addNode(node);
            node.id = dNode.id;
            // get position
            var x = data["nodes"][node.id].x;
            var y = data["nodes"][node.id].y;
            node.setCenter(x, y);
        }
        // add connection one by one
        for (let dcon of designer.conns) {
            var con = new ConnectionGraphicsItem();
            con.id = dcon.id;
            // get nodes
            var leftNode = s.getNodeById(dcon.leftNode.id);
            var rightNode = s.getNodeById(dcon.rightNode.id);
            // get sockets
            con.socketA = leftNode.getOutSocketByName(dcon.leftNodeOutput);
            con.socketB = rightNode.getInSocketByName(dcon.rightNodeInput);
            s.addConnection(con);
        }
        return s;
    }
}
// https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function _getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
//# sourceMappingURL=scene.js.map