/*
  RenderEngine1 class
*/

export class RenderEngine {
  constructor(){

  }
  /*
    params: elements: array of elements to render
  */
  render( elements ){
    elements.map((element, i)=>{
      element.draw();
    });
  }
}
