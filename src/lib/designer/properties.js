import { Color } from "./color";
import { Gradient } from "./gradient";
// for use in code after build
export var PropertyType;
(function (PropertyType) {
    PropertyType["Float"] = "float";
    PropertyType["Int"] = "int";
    PropertyType["Bool"] = "bool";
    PropertyType["Color"] = "color";
    PropertyType["Enum"] = "enum";
    PropertyType["String"] = "string";
    PropertyType["Gradient"] = "gradient";
    PropertyType["FloatArray"] = "floatArray";
})(PropertyType || (PropertyType = {}));
export class Property {
    // to be overriden
    getValue() {
        return null;
    }
    setValue(val) { }
    clone() {
        return null;
    }
}
export class FloatProperty extends Property {
    constructor(name, displayName, value, step = 1) {
        super();
        this.minValue = 0;
        this.maxValue = 1;
        this.step = 1;
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.step = step;
        this.type = PropertyType.Float;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        // todo: validate
        this.value = val;
    }
    clone() {
        var prop = new FloatProperty(this.name, this.displayName, this.value, this.step);
        prop.minValue = this.minValue;
        prop.maxValue = this.maxValue;
        return prop;
    }
    copyValuesFrom(prop) {
        this.minValue = prop.minValue;
        this.maxValue = prop.maxValue;
        this.value = prop.value;
        this.step = prop.step;
    }
}
export class FloatArrayProperty extends Property {
    constructor(name, displayName, value, step = 1, maxArraySize = 8) {
        super();
        this.value = new Array();
        this.minValue = 0;
        this.maxValue = 1;
        this.step = 1;
        this.maxArraySize = 8;
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.step = step;
        this.maxArraySize = maxArraySize;
        this.type = PropertyType.FloatArray;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        // todo: validate
        this.value = val;
    }
    clone() {
        var prop = new FloatArrayProperty(this.name, this.displayName, this.value, this.step);
        prop.minValue = this.minValue;
        prop.maxValue = this.maxValue;
        return prop;
    }
    copyValuesFrom(prop) {
        this.minValue = prop.minValue;
        this.maxValue = prop.maxValue;
        this.value = prop.value;
        this.step = prop.step;
    }
}
export class IntProperty extends Property {
    constructor(name, displayName, value, step = 1) {
        super();
        this.minValue = 0;
        this.maxValue = 100;
        this.step = 1;
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.step = step;
        this.type = PropertyType.Int;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        // todo: validate
        this.value = val;
    }
    clone() {
        var prop = new IntProperty(this.name, this.displayName, this.value, this.step);
        prop.minValue = this.minValue;
        prop.maxValue = this.maxValue;
        return prop;
    }
    copyValuesFrom(prop) {
        this.minValue = prop.minValue;
        this.maxValue = prop.maxValue;
        this.value = prop.value;
        this.step = prop.step;
    }
}
export class BoolProperty extends Property {
    constructor(name, displayName, value) {
        super();
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.type = PropertyType.Bool;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        // todo: validate
        this.value = val;
    }
    clone() {
        var prop = new BoolProperty(this.name, this.displayName, this.value);
        return prop;
    }
    copyValuesFrom(prop) {
        this.value = prop.value;
    }
}
export class EnumProperty extends Property {
    constructor(name, displayName, values) {
        super();
        this.index = 0;
        this.name = name;
        this.displayName = displayName;
        this.values = values;
        this.type = PropertyType.Enum;
    }
    getValues() {
        return this.values;
    }
    getValue() {
        return this.index;
    }
    setValue(val) {
        // todo: validate
        this.index = val;
    }
    clone() {
        var prop = new EnumProperty(this.name, this.displayName, this.values.slice(0));
        prop.index = this.index;
        return prop;
    }
    copyValuesFrom(prop) {
        this.values = prop.values;
        this.index = prop.index;
    }
}
export class ColorProperty extends Property {
    constructor(name, displayName, value) {
        super();
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.type = PropertyType.Color;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        // todo: validate
        console.log("got color: " + val);
        if (val instanceof Color)
            this.value = val;
        else if (typeof val == "string")
            this.value = Color.parse(val);
        else if (typeof val == "object") {
            console.log("setting value", val);
            var value = new Color();
            value.r = val.r || 0;
            value.g = val.g || 0;
            value.b = val.b || 0;
            value.a = val.a || 1.0;
            this.value = value;
        }
    }
    clone() {
        var prop = new ColorProperty(this.name, this.displayName, this.value);
        return prop;
    }
    copyValuesFrom(prop) {
        this.setValue(prop.value);
    }
}
export class StringProperty extends Property {
    constructor(name, displayName, value = "") {
        super();
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.type = PropertyType.String;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        // todo: validate
        this.value = val;
    }
    clone() {
        var prop = new StringProperty(this.name, this.displayName, this.value);
        return prop;
    }
    copyValuesFrom(prop) {
        this.value = prop.value;
    }
}
export class GradientProperty extends Property {
    constructor(name, displayName, value) {
        super();
        this.name = name;
        this.displayName = displayName;
        this.value = value;
        this.type = PropertyType.Gradient;
    }
    getValue() {
        return this.value;
    }
    setValue(val) {
        console.log("setting gradient value");
        this.value = Gradient.parse(val);
    }
    clone() {
        var prop = new GradientProperty(this.name, this.displayName, this.value.clone());
        return prop;
    }
    copyValuesFrom(prop) {
        console.log("copy value from gradient");
        this.setValue(prop.value.clone());
    }
}
//# sourceMappingURL=properties.js.map