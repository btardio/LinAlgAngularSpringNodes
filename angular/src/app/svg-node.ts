import { LinAlgEdge } from './edge';
import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { RenderableType } from './renderable-type.enum';
import { LinkedList as basLinkedList } from 'typescript-collections';

export class SvgRenderableContainer {

  matrices: basLinkedList<SvgNodeMatrix> = new basLinkedList<SvgNodeMatrix>();
  functions: basLinkedList<SvgNodeFunction> = new basLinkedList<SvgNodeFunction>();
  edges: basLinkedList<SvgEdge> = new basLinkedList<SvgEdge>();

}


export class SvgRenderable {
  id: number;
  labelType: string;
  private label: string;
  classStr: string;
  renderableType: RenderableType;

  constructor( ) {
    this.labelType = 'html';
    this.classStr = 'dagrenode';
  }

  getLabel(): string {
    return this.label;
  }

  setLabel( label: string ) {
    this.label = label;
  }

  toString(): string {

    return '{id: ' + this.id + ',renderableType:' + this.renderableType + '}';

  }

  getId(): number {
    return this.id;
  }


  getRenderableType(): RenderableType {
    return this.renderableType;
  }
}


export class SvgNodeMatrix extends SvgRenderable {

  matrix: LinAlgMatrix;

  constructor( matrix: LinAlgMatrix ) {

    super();

    this.renderableType = RenderableType.SvgMatrixNode;

    this.matrix = matrix;

    this.id = matrix.getId();

    let label = '';

    label += '<div class="toggle-switch"><input ';
    if ( matrix.getSelected() ) { label += 'checked="true"'; }
    label += 'type="checkbox" id=' + this.id +
      ' onclick=window.angularComponentReference.zone.run(()&#61;&#62;{window.angularComponentReference.togselect(' +
        + this.id + ',&quot;matrix&quot;);});><label for=' + this.id +
      '></label></div>';
    label += '<center><div class="mathjaxm" style="z-index:100;" id=' +
        'mathjaxid' + this.id  + '><center>' +
        matrix.toKatexString() +
        '</center></div></center>';

    this.setLabel(label);

  }

  getMatrix(): LinAlgMatrix {
    return this.matrix;
  }

}


export class SvgNodeFunction extends SvgRenderable {

  ffunction: LinAlgFunction;

  constructor( ffunction: LinAlgFunction ) {

    super();

    this.renderableType = RenderableType.SvgFunctionNode;

    this.ffunction = ffunction;

    this.id = ffunction.getId();

    let label = '';

    label += '<div class="toggle-switch"><input ';
    if ( ffunction.getSelected() ) { label += 'checked="true"'; }
    label += 'type="checkbox" id=' + this.id +
      ' onclick=window.angularComponentReference.zone.run(()&#61;&#62;{window.angularComponentReference.togselect(' +
        + this.id + ',&quot;function&quot;);});><label for=' + this.id +
      '></label></div>';
    label += '<div>' + this.id + ffunction.toString() + '</div>';

    this.setLabel(label);
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

