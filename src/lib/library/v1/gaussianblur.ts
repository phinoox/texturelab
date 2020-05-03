import { DesignerNode } from "../../designer/designernode";

// https://thebookofshaders.com/07/


export class GaussianBlurNode extends DesignerNode {
	public init() {
		this.title = "Gaussian Blur";
        this.addInput("image");
        this.addIntProperty("size", "Size", 3, 3, 12, 1);
        this.addIntProperty("deviation", "Deviation", 1, 1, 6, 1);
        this.addFloatProperty("offsetScale","Offset Scale",1,0.1,10.0,0.1);
        this.addFloatArrayProperty("kernel","kernel",new Array(),0,1,0.001,12);
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

    protected onSetProperty(name: string,value:any){
        if(name=="kernel")
           return;
        this.calculateGaussianKernel();
        this.requestUpdate();
    }
    
   private calculateGaussianKernel(){
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
  for (let row = 0; row < size; row++){
      kernel[row] /= sum;
  }
  this.setProperty("kernel",kernel);
}

private gaussian( x: number , mu: number,sigma : number ) {
    //let a = ( x - mu ) / sigma;
    //return Math.exp( -0.5 * a * a );
    let left = 1.0 / (Math.sqrt(2.0 * 3.14159 * Math.pow(sigma,2)));
    let right= Math.exp(-1*(Math.pow(x,2) / Math.pow(2*sigma,2)));
    return left * right;
}

 

}
