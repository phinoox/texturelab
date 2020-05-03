export class DesignerNodeFactory {
}
// holds list of node factories
export class DesignerLibrary {
    constructor() {
        this.nodes = new Array();
    }
    // https://www.snip2code.com/Snippet/685188/Create-instance-of-generic-type-on-TypeS
    addNode(name, displayName, type) {
        var factory = new DesignerNodeFactory();
        factory.name = name;
        factory.displayName = displayName;
        factory.create = () => {
            return new type();
        };
        //this.nodes.push(factory);
        this.nodes[name] = factory;
    }
    getVersionName() {
        return this.versionName;
    }
    create(name) {
        //if (this.nodes.indexOf(name) == -1)
        //    return null;
        var node = this.nodes[name].create();
        node.typeName = name;
        return node;
    }
}
//# sourceMappingURL=library.js.map