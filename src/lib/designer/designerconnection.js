import { Guid } from "../utils";
export class DesignerNodeConn {
    constructor() {
        this.id = Guid.newGuid();
        this.leftNodeOutput = ""; // if null, use first output
    }
}
//# sourceMappingURL=designerconnection.js.map