import { DesignerNode } from "../../designer/designernode";
// https://thebookofshaders.com/07/
export class GaussianBlurNode extends DesignerNode {
    init() {
        this.title = "Gaussian Blur";
        this.addInput("image");
        this.addIntProperty("size", "Size", 3, 3, 12, 1);
        this.addIntProperty("deviation", "Deviation", 1, 1, 6, 1);
        this.addFloatProperty("offsetScale", "Offset Scale", 1, 0.1, 10.0, 0.1);
        this.addFloatArrayProperty("kernel", "kernel", new Array(), 0, 1, 0.001, 12);
        this.addEnumProperty("orientation", "Orientation", [
            "Horizontal",
            "Vertical"
        ]);
        var source = `
        vec4 process(vec2 uv)
        {
            vec4 FragmentColor =texture(image,uv)*prop_kernel[0];
            
            for (int i=1; i < prop_size; i++) {
                float offset = (float(i) * prop_offsetScale ) / _textureSize.x;
                float offsetX = prop_orientation == 0 ? offset : 0.0;
                float offsetY = prop_orientation == 1 ? offset : 0.0;
                FragmentColor +=
                texture(image, (vec2(uv) + vec2(offsetX,offsetY)) )
                        * prop_kernel[i];
                FragmentColor +=
                texture(image, (vec2(uv) - vec2(offsetX,offsetY)) )
                        * prop_kernel[i];
            }
           
            return FragmentColor;
        }
        `;
        this.buildShader(source);
    }
    onSetProperty(name, value) {
        if (name == "kernel")
            return;
        this.calculateGaussianKernel();
        this.requestUpdate();
    }
    calculateGaussianKernel() {
        let sigma = this.getProperty("deviation").getValue();
        let size = this.getProperty("size").getValue();
        let kernel = new Array();
        let sum = 0;
        // compute values
        for (let row = 0; row < size; row++) {
            let x = this.gaussian(row, 0, sigma);
            kernel[row] = x;
            sum += row > 0 ? x * 2 : x;
        }
        // normalize
        for (let row = 0; row < size; row++) {
            kernel[row] /= sum;
        }
        this.setProperty("kernel", kernel);
    }
    gaussian(x, mu, sigma) {
        //let a = ( x - mu ) / sigma;
        //return Math.exp( -0.5 * a * a );
        let left = 1.0 / (Math.sqrt(2.0 * 3.14159 * Math.pow(sigma, 2)));
        let right = Math.exp(-1 * (Math.pow(x, 2) / Math.pow(2 * sigma, 2)));
        return left * right;
    }
    gaussianDistribution(x, mu, sigma) {
        var d = x - mu;
        var n = 1.0 / (Math.sqrt(2 * Math.PI) * sigma);
        return Math.exp(-d * d / (2 * sigma * sigma)) * n;
    }
    sampleInterval(f, minInclusive, maxInclusive, sampleCount) {
        var result = [];
        var stepSize = (maxInclusive - minInclusive) / (sampleCount - 1);
        for (var s = 0; s < sampleCount; ++s) {
            var x = minInclusive + s * stepSize;
            var y = f(x);
            result.push([x, y]);
        }
        return result;
    }
    integrateSimphson(samples) {
        var result = samples[0][1] + samples[samples.length - 1][1];
        for (var s = 1; s < samples.length - 1; ++s) {
            var sampleWeight = (s % 2 == 0) ? 2.0 : 4.0;
            result += sampleWeight * samples[s][1];
        }
        var h = (samples[samples.length - 1][0] - samples[0][0]) / (samples.length - 1);
        return result * h / 3.0;
    }
    roundTo(num, decimals) {
        var shift = Math.pow(10, decimals);
        return Math.round(num * shift) / shift;
    }
    updateKernel(sigma, kernelSize, sampleCount) {
        var samplesPerBin = Math.ceil(sampleCount / kernelSize);
        if (samplesPerBin % 2 == 0) // need an even number of intervals for simpson integration => odd number of samples
            ++samplesPerBin;
        var weightSum = 0;
        var kernelLeft = -Math.floor(kernelSize / 2);
        var calcSamplesForRange = function (minInclusive, maxInclusive) {
            return this.sampleInterval(function (x) {
                return this.gaussianDistribution(x, 0, sigma);
            }, minInclusive, maxInclusive, samplesPerBin);
        };
        // get samples left and right of kernel support first
        var outsideSamplesLeft = calcSamplesForRange(-5 * sigma, kernelLeft - 0.5);
        var outsideSamplesRight = calcSamplesForRange(-kernelLeft + 0.5, 5 * sigma);
        var allSamples = [[outsideSamplesLeft, 0]];
        // now sample kernel taps and calculate tap weights
        for (var tap = 0; tap < kernelSize; ++tap) {
            var left = kernelLeft - 0.5 + tap;
            var tapSamples = calcSamplesForRange(left, left + 1);
            var tapWeight = this.integrateSimphson(tapSamples);
            allSamples.push([tapSamples, tapWeight]);
            weightSum += tapWeight;
        }
        allSamples.push([outsideSamplesRight, 0]);
        // renormalize kernel and round to 6 decimals
        for (var i = 0; i < allSamples.length; ++i) {
            allSamples[i][1] = allSamples[i][1] / weightSum;
        }
        let kernel = new Array();
        for (var i = 1; i < allSamples.length - 1; ++i) {
            kernel[i - 1] = allSamples[i][1];
        }
        this.setProperty("kernel", kernel);
    }
}
//# sourceMappingURL=gaussianblur.js.map