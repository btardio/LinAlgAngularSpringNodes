// /// <reference path="../../node_modules/@types/mathjax/index.d.ts" />
/// <reference path="../../node_modules/@types/katex/index.d.ts" />

import { LinAlgEdge } from './edge';
import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { MatrixService } from './matrix-service.service';
import { MorF } from './mor-f.enum';
import { RenderableType } from './renderable-type.enum';
import { SvgMessage } from './svg-message';
import { SvgRenderable, SvgNodeMatrix, SvgNodeFunction, SvgEdge } from './svg-node';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Bag as basBag } from 'typescript-collections';
import { OnInit } from '@angular/core';
import * as katexrender from 'katex';
// import { KatexModule } from 'ng-katex';
// import { KatexComponent } from 'ng-katex';

//import { MathJax } from 'mathjax';
// import * as mmjax from 'mathjaxnode';
 

 
@Injectable({
  providedIn: 'root'
})
export class SvgRenderService  {

  private toggledSvg: Subject<SvgMessage> = new Subject<SvgMessage>();
  toggledSvg$: Observable<SvgMessage> = this.toggledSvg.asObservable();

  private renderSignal: Subject<Array<SvgRenderable>> = new Subject<Array<SvgRenderable>>();
  renderSignal$: Observable<Array<SvgRenderable>> = this.renderSignal.asObservable();

  nodes: Array<SvgRenderable>;

  mjAPI: any;

  constructor( private matrixService: MatrixService ) {

    this.nodes = new Array<SvgRenderable>();

    this.matrixService.containerChanged$.subscribe(
      matrixchangebool => {

        this.render();

    });

   }

  toggle( svgMessage: SvgMessage ) {

    this.addSelectedNodeToMatrixService( svgMessage );
    // this.changeNodeText( svgMessage );

    this.toggledSvg.next( svgMessage );

  }
//
//  changeNodeText( svgMessage: SvgMessage ): void {
//
//    if ( svgMessage.getElement().textContent === 'Select' ) {
//      svgMessage.getElement().textContent = 'Select (Selected)';
//
//      if ( svgMessage.getMorf() === MorF.Function ) {
//        if ( this.matrixService.getFunctionWithId(svgMessage.getId()).getSelected() === false ) {
//            throw Error('Select / Unselect Error.');
//        }
//      }
//      else if ( svgMessage.getMorf() === MorF.Matrix ) {
//        if ( this.matrixService.getMatrixWithId(svgMessage.getId()).getSelected() === false ) {
//            throw Error('Select / Unselect Error.');
//        }
//      }
//    }
//    else if ( svgMessage.getElement().textContent === 'Select (Selected)' ) {
//      svgMessage.getElement().textContent = 'Select';
//
//      if ( svgMessage.getMorf() === MorF.Function ) {
//        if ( this.matrixService.getFunctionWithId(svgMessage.getId()).getSelected() === true ) {
//            throw Error('Select / Unselect Error.');
//        }
//      }
//      else if ( svgMessage.getMorf() === MorF.Matrix ) {
//        if ( this.matrixService.getMatrixWithId(svgMessage.getId()).getSelected() === true ) {
//            throw Error('Select / Unselect Error.');
//        }
//      }
//
//    }
//    else {
//      throw Error('Node text is neither Select or Select (Selected).');
//    }
//
//  }


  addSelectedNodeToMatrixService( svgMessage: SvgMessage ): void {

      // console.dir( svgMessage.getElement() );
      // console.log( 'istrue:' + ( svgMessage.getElement().checked === true ) );
      // if ( 1 + 1 === 2 ) { return; }

      if ( svgMessage.getElement().checked === true ) {
        if ( svgMessage.getMorf() === MorF.Function ) {
          this.matrixService.addSelectedFunction(svgMessage.getId());
        }
        else if ( svgMessage.getMorf() === MorF.Matrix ) {
          this.matrixService.addSelectedMatrix(svgMessage.getId());
        }
        else {
          throw Error('Attempting to add an unknown node type to selected container.');
        }
      }
      else if ( svgMessage.getElement().checked === false ) {

        if ( svgMessage.getMorf() === MorF.Function ) {
          this.matrixService.removeSelectedFunction(svgMessage.getId());
        }
        else if ( svgMessage.getMorf() === MorF.Matrix ) {
          this.matrixService.removeSelectedMatrix(svgMessage.getId());
        }
        else {
          throw Error('Attempting to remove an unknown node type from selected container.');
        }

      }
      else {
        throw Error('Node is neither checked nor unchecked, must be undefined.');
      }

  }

  textToMathJax( renderable: SvgRenderable ): SvgRenderable {
    // katex.renderToString('');
    // console.log ( katexrender.renderToString('c = \\pm\\sqrt{a^2 + b^2}') ); 
    
    // renderable.label = katexrender.renderToString('c = \\pm\\sqrt{a^2 + b^2}');
    
   // const kc: KatexComponent = new KatexComponent();
    // const km: KatexModule = new KatexModule();
    
    // km.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
    
    
//    console.log('textToMathJax');
//    MathJax.Hub.Queue(function() { console.log('mathjaxhubqueue'); });
//    // ['Typeset', MathJax.Hub, 'mathjaxp']
//    MathJax.Hub.Type.Typeset( {
//  math: 'E = mc^2'
//}, function (data) {
//  console.dir(data) } );
    
    // const mjaxhub: MathJax.Hub = new MathJax.Hub();
    
    
    
//
//    const yourMath = 'E = mc^2';
//
//    this.mjAPI.typeset({
//      math: yourMath,
//      format: 'TeX', // or "inline-TeX", "MathML"
//      mml: true,      // or svg:true, or html:true
//    }, function (data) {
//      if (!data.errors) { console.log(data.mml); }
//      // will produce:
//      // <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
//      //   <mi>E</mi>
//      //   <mo>=</mo>
//      //   <mi>m</mi>
//      //   <msup>
//      //     <mi>c</mi>
//      //     <mn>2</mn>
//      //   </msup>
//      // </math>
//    });
//
    return renderable;
  }

  render(): void {

    const matrices: Array<LinAlgMatrix> = this.matrixService.getMatrices();

    const functions: Array<LinAlgFunction> = this.matrixService.getFunctions();

    const edges: basBag<LinAlgEdge> = this.matrixService.getEdges();

    while ( this.nodes.length > 0 ) {
      this.nodes.pop();
    }

    for ( let i = 0; i < matrices.length; i++ ) {
      let newnode: SvgNodeMatrix = new SvgNodeMatrix( matrices[i] );
      newnode = <SvgNodeMatrix>this.textToMathJax( newnode );
      this.nodes.push( newnode );
    }

    for ( let i = 0; i < functions.length; i++ ) {
      let newnode: SvgNodeFunction = new SvgNodeFunction( functions[i] );
      newnode = <SvgNodeFunction>this.textToMathJax( newnode );
      this.nodes.push( newnode );
    }

    edges.forEach( edge => {
      this.nodes.push( new SvgEdge( edge ) );
    });

    this.renderSignal.next( this.nodes );

  }


}
