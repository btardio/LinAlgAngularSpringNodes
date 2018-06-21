import { LinAlgEdge } from './edge';
import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { RenderableType } from './renderable-type.enum';



export class SvgRenderable {
  id: number;
  labelType: string;
  label: string;
  classStr: string;
  renderableType: RenderableType;
//  selectedText: string;

  constructor( ) {
    this.labelType = 'html';
    this.classStr = 'dagrenode';
//    this.selectedText = 'No Text';
  }

  toString(): string {

    return 'id: ' + this.id + 'renderableType:' + this.renderableType;

  }

  getId(): number {
    return this.id;
  }

//  getSelectedText(): string {
//    return this.selectedText;
//  }


  getRenderableType(): RenderableType {
    return this.renderableType;
  }
}


export class SvgNodeMatrix extends SvgRenderable {

  matrix: LinAlgMatrix;

  constructor( matrix: LinAlgMatrix ) {

    super();

//    if ( matrix.getSelected() ) {
//      this.selectedText = 'Select (Selected)';
//    }
//    else {
//      this.selectedText = 'Select';
//    }

    this.renderableType = RenderableType.SvgMatrixNode;

    this.matrix = matrix;

    this.id = matrix.getId();

    this.label = '';
    this.label += '<div class="toggle-switch"><input ';
    if ( matrix.getSelected() ) { this.label += 'checked="true"'; }
    this.label += 'type="checkbox" id=' + this.id +
      ' onclick=window.angularComponentReference.zone.run(()&#61;&#62;{window.angularComponentReference.togselect(' +
        + this.id + ',&quot;matrix&quot;);});><label for=' + this.id +
      '></label></div>';
    this.label += '<center><div class="mathjaxm" style="z-index:100;" id=' +
        'mathjaxid' + this.id  + '><center>' +
        matrix.toMathJaxString() +
        '</center></div></center>';



  }

  getMatrix(): LinAlgMatrix {
    return this.matrix;
  }

}


export class SvgNodeFunction extends SvgRenderable {

  ffunction: LinAlgFunction;

  constructor( ffunction: LinAlgFunction ) {

    super();

//    if ( ffunction.getSelected() ) {
//      this.selectedText = 'Select (Selected)';
//    }
//    else {
//      this.selectedText = 'Select';
//    }

    this.renderableType = RenderableType.SvgFunctionNode;

    this.ffunction = ffunction;

    this.id = ffunction.getId();

    this.label = '';
    this.label += '<div class="toggle-switch"><input '
    if ( ffunction.getSelected() ) { this.label += 'checked="true"'; }
    this.label += 'type="checkbox" id=' + this.id + 
      ' onclick=window.angularComponentReference.zone.run(()&#61;&#62;{window.angularComponentReference.togselect(' +
        + this.id + ',&quot;function&quot;);});><label for=' + this.id + 
      '></label></div>';
    this.label += '<div>' + this.id + ffunction.toString() + '</div>';
  }

  getFunction() {
    return this.ffunction;
  }
}


export class SvgEdge extends SvgRenderable {

  edge: LinAlgEdge;

  constructor( edge: LinAlgEdge ) {

    super();

    this.renderableType = RenderableType.SvgEdge;

    this.edge = edge;

    this.id = edge.getId();
  }

}

