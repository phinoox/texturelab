export var DesignerVariableType;
(function (DesignerVariableType) {
    DesignerVariableType[DesignerVariableType["None"] = 0] = "None";
    DesignerVariableType[DesignerVariableType["Float"] = 1] = "Float";
    DesignerVariableType[DesignerVariableType["Int"] = 2] = "Int";
    DesignerVariableType[DesignerVariableType["Bool"] = 3] = "Bool";
    DesignerVariableType[DesignerVariableType["Enum"] = 4] = "Enum";
    DesignerVariableType[DesignerVariableType["Color"] = 5] = "Color";
    //Gradient
})(DesignerVariableType || (DesignerVariableType = {}));
export class DesignerNodePropertyMap {
}
export class DesignerVariable {
    constructor() {
        this.nodes = new Array();
    }
}
//# sourceMappingURL=designervariable.js.map