// /// <reference path="../../node_modules/@types/mathjax/index.d.ts" />
/// <reference path="../../node_modules/@types/katex/index.d.ts" />

import { LinAlgEdge } from './edge';
import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { MatrixService } from './matrix-service.service';
import { MorF } from './mor-f.enum';
import { RenderableType } from './renderable-type.enum';
import { SvgMessage } from './svg-message';
import { SvgMessageType } from './svg-message-type.enum';
import { SvgRenderable, SvgNodeMatrix, SvgNodeFunction, SvgEdge, SvgRenderableContainer } from './svg-node';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Bag as basBag } from 'typescript-collections';
import { OnInit } from '@angular/core';
import * as katexrender from 'katex';
import { LinkedList as basLinkedList } from 'typescript-collections';
import { Set as basSet } from 'typescript-collections';
import { Queue as basQueue } from 'typescript-collections';

// import { KatexModule } from 'ng-katex';
// import { KatexComponent } from 'ng-katex';

//import { MathJax } from 'mathjax';
// import * as mmjax from 'mathjaxnode';



@Injectable({
  providedIn: 'root'
})
export class SvgRenderService  {

  // private toggledSvg: Subject<SvgMessage> = new Subject<SvgMessage>();
  // toggledSvg$: Observable<SvgMessage> = this.toggledSvg.asObservable();

  private renderSignal: Subject<SvgRenderableContainer> = new Subject<SvgRenderableContainer>();
  renderSignal$: Observable<SvgRenderableContainer> = this.renderSignal.asObservable();

  // nodes: Array<SvgRenderable>;

  svgRenderableContainer: SvgRenderableContainer = new SvgRenderableContainer();

//  mjAPI: any;

  constructor( private matrixService: MatrixService ) {

//    this.nodes = new Array<SvgRenderable>();

    this.matrixService.containerChanged$.subscribe(
      matrixchangebool => {

        this.render();

    });

   }

  consumeSvgMessage( svgMessage: SvgMessage ) {

    switch ( svgMessage.getMessageType() ) {
      case SvgMessageType.Select: {
        this.addSelectedNodeToMatrixService( svgMessage );
        break;
      }
    }

    // this.changeNodeText( svgMessage );

    // this.toggledSvg.next( svgMessage );

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

  nonRecurNodes( svgRenderableContainer: SvgRenderableContainer, m: LinAlgMatrix, f: LinAlgFunction ) {

    const visitedFunctions: basQueue<LinAlgFunction> = new basQueue<LinAlgFunction>();
    const visitedMatrices: basQueue<LinAlgMatrix> = new basQueue<LinAlgMatrix>();

    const currentFunctions: basQueue<LinAlgFunction> = new basQueue<LinAlgFunction>();
    const currentMatrices: basQueue<LinAlgMatrix> = new basQueue<LinAlgMatrix>();

    let done = false;

    if ( f != null ) { currentFunctions.enqueue(f); }
    if ( m != null ) { currentMatrices.enqueue(m); }

    while ( !done ) {

      const wwf: LinAlgFunction = currentFunctions.dequeue();
      if ( wwf != null ) {
        const gim: basLinkedList<LinAlgMatrix> = wwf.getInputMatrices();
        for ( let i = 0; i < gim.size(); i++ ) { currentMatrices.enqueue( gim.elementAtIndex(i) ); }
      }
      visitedFunctions.enqueue(wwf);

      const wwm: LinAlgMatrix = currentMatrices.dequeue();
      if ( wwm != null ) {
        const gif: basLinkedList<LinAlgFunction> = wwm.getInputFunctions();
        for ( let i = 0; i < gif.size(); i++ ) { currentFunctions.enqueue( gif.elementAtIndex(i) ); }
      }
      visitedMatrices.enqueue(wwm);

      if ( currentFunctions.size() === 0 && currentMatrices.size() === 0 ) { done = true; }

    }

    while ( visitedMatrices.size() > 0 ) {
      const snm: SvgNodeMatrix = new SvgNodeMatrix( visitedMatrices.dequeue() );
      if ( !svgRenderableContainer.matrices.contains(snm) ) { svgRenderableContainer.matrices.add( snm ); }
    } 

    while ( visitedFunctions.size() > 0 ){
      const snf: SvgNodeFunction = new SvgNodeFunction( visitedFunctions.dequeue() );
      if ( !svgRenderableContainer.functions.contains(snf) ) { svgRenderableContainer.functions.add( snf ); }
    }
//    visitedMatrices.forEach(mfev => {
//      const snm: SvgNodeMatrix = new SvgNodeMatrix( mfev );
//      if ( !svgRenderableContainer.matrices.contains(snm) ) {
//        svgRenderableContainer.matrices.add( snm );
//      }
//    });
//    visitedFunctions.forEach(ffev => {
//      const snf: SvgNodeFunction = new SvgNodeFunction( ffev );
//      if ( !svgRenderableContainer.functions.contains(snf) ) {
//        svgRenderableContainer.functions.add( snf );
//      }
//    });


  }

  render(): void {

    const matrices: Array<LinAlgMatrix> = this.matrixService.getMatrices();

    const functions: Array<LinAlgFunction> = this.matrixService.getFunctions();

    const edges: basBag<LinAlgEdge> = this.matrixService.getEdges();

    this.svgRenderableContainer.edges.clear();
    this.svgRenderableContainer.functions.clear();
    this.svgRenderableContainer.matrices.clear();

    // const orderedNodes: basLinkedList<SvgRenderable> = new basLinkedList<SvgRenderable>();


    // find no output matrices, add to nodes
    //
    // repeat
    // {
    // find input functions of matrix, add to nodes in order
    // find input matrices of function, add matrices to nodes in order
    // }
    //
    // add all edges in any order

    const endMatrices: basSet<LinAlgMatrix> = this.matrixService.getMatricesWithoutOutputs();

    const endFunctions: basSet<LinAlgFunction> = this.matrixService.getFunctionsWithoutOutputs();

    const endMatricesArray: Array<LinAlgMatrix> = endMatrices.toArray();

    for ( let j = 0; j < endMatricesArray.length; j++ ) {

      const visitedFunctions: basQueue<LinAlgFunction> = new basQueue<LinAlgFunction>();
      const visitedMatrices: basQueue<LinAlgMatrix> = new basQueue<LinAlgMatrix>();

      const currentFunctions: basQueue<LinAlgFunction> = new basQueue<LinAlgFunction>();
      const currentMatrices: basQueue<LinAlgMatrix> = new basQueue<LinAlgMatrix>();

      let done = false;

      currentMatrices.enqueue(endMatricesArray[j]);

      while ( !done ) {

        const wwf: LinAlgFunction = currentFunctions.dequeue();
        if ( wwf != null ) {
          const gim: basLinkedList<LinAlgMatrix> = wwf.getInputMatrices();
          for ( let i = 0; i < gim.size(); i++ ) { currentMatrices.enqueue( gim.elementAtIndex(i) ); }
        }
        visitedFunctions.enqueue(wwf);

        const wwm: LinAlgMatrix = currentMatrices.dequeue();
        if ( wwm != null ) {
          const gif: basLinkedList<LinAlgFunction> = wwm.getInputFunctions();
          for ( let i = 0; i < gif.size(); i++ ) { currentFunctions.enqueue( gif.elementAtIndex(i) ); }
        }
        visitedMatrices.enqueue(wwm);

        if ( currentFunctions.size() === 0 && currentMatrices.size() === 0 ) { done = true; }

      }

      while ( visitedMatrices.size() > 0 ) {
        const snm: SvgNodeMatrix = new SvgNodeMatrix( visitedMatrices.dequeue() );
        if ( !this.svgRenderableContainer.matrices.contains(snm) ) { this.svgRenderableContainer.matrices.add( snm ); }
      }

      while ( visitedFunctions.size() > 0 ) {
        const dequeuedfunction: LinAlgFunction = visitedFunctions.dequeue();
        const snf: SvgNodeFunction = new SvgNodeFunction( dequeuedfunction );
        if ( !this.svgRenderableContainer.functions.contains(snf) ) {
          this.svgRenderableContainer.functions.add( snf );
        }
        dequeuedfunction.getEdges().forEach( e => {
          const newSvgEdge: SvgEdge = new SvgEdge(e);
          if ( !this.svgRenderableContainer.edges.contains ( newSvgEdge ) ) {
            this.svgRenderableContainer.edges.add( newSvgEdge );
          }
        });
      }
    }


    const endFunctionsArray: Array<LinAlgFunction> = endFunctions.toArray();

    for ( let j = 0; j < endFunctionsArray.length; j++ ) {

      const visitedFunctions: basQueue<LinAlgFunction> = new basQueue<LinAlgFunction>();
      const visitedMatrices: basQueue<LinAlgMatrix> = new basQueue<LinAlgMatrix>();

      const currentFunctions: basQueue<LinAlgFunction> = new basQueue<LinAlgFunction>();
      const currentMatrices: basQueue<LinAlgMatrix> = new basQueue<LinAlgMatrix>();

      let done = false;

      currentFunctions.enqueue(endFunctionsArray[j]);

      while ( !done ) {

        const wwf: LinAlgFunction = currentFunctions.dequeue();
        if ( wwf != null ) {
          const gim: basLinkedList<LinAlgMatrix> = wwf.getInputMatrices();
          for ( let i = 0; i < gim.size(); i++ ) { currentMatrices.enqueue( gim.elementAtIndex(i) ); }
        }
        visitedFunctions.enqueue(wwf);

        const wwm: LinAlgMatrix = currentMatrices.dequeue();
        if ( wwm != null ) {
          const gif: basLinkedList<LinAlgFunction> = wwm.getInputFunctions();
          for ( let i = 0; i < gif.size(); i++ ) { currentFunctions.enqueue( gif.elementAtIndex(i) ); }
        }
        visitedMatrices.enqueue(wwm);

        if ( currentFunctions.size() === 0 && currentMatrices.size() === 0 ) { done = true; }

      }

      while ( visitedMatrices.size() > 0 ) {
        const snm: SvgNodeMatrix = new SvgNodeMatrix( visitedMatrices.dequeue() );
        if ( !this.svgRenderableContainer.matrices.contains(snm) ) { this.svgRenderableContainer.matrices.add( snm ); }
      }

      while ( visitedFunctions.size() > 0 ) {
        const dequeuedfunction: LinAlgFunction = visitedFunctions.dequeue();
        const snf: SvgNodeFunction = new SvgNodeFunction( dequeuedfunction );
        if ( !this.svgRenderableContainer.functions.contains(snf) ) {
          this.svgRenderableContainer.functions.add( snf );
        }
        dequeuedfunction.getEdges().forEach( e => {
          const newSvgEdge: SvgEdge = new SvgEdge(e);
          if ( !this.svgRenderableContainer.edges.contains ( newSvgEdge ) ) {
            this.svgRenderableContainer.edges.add( newSvgEdge );
          }
        });

      }
    }

//    const edgesArray: Array<LinAlgEdge> = edges.toArray();
//    for ( let i = 0; i < edgesArray.length; i++ ) {
//      this.svgRenderableContainer.edges.add( new SvgEdge( edgesArray[i] ) );
//    }

    // console.dir(this.svgRenderableContainer.matrices.toArray());
    // console.dir(this.svgRenderableContainer.functions.toArray());
    // console.dir(orderedNodes);

//    while ( this.nodes.length > 0 ) {
//      this.nodes.pop();
//    }
//
//    for ( let i = 0; i < matrices.length; i++ ) {
//      let newnode: SvgNodeMatrix = new SvgNodeMatrix( matrices[i] );
//      newnode = <SvgNodeMatrix>this.textToMathJax( newnode );
//      this.nodes.push( newnode );
//    }
//
//    for ( let i = 0; i < functions.length; i++ ) {
//      let newnode: SvgNodeFunction = new SvgNodeFunction( functions[i] );
//      newnode = <SvgNodeFunction>this.textToMathJax( newnode );
//      this.nodes.push( newnode );
//    }
//
//    edges.forEach( edge => {
//      this.nodes.push( new SvgEdge( edge ) );
//    });

    //this.renderSignal.next( this.nodes );
    this.renderSignal.next( this.svgRenderableContainer );

  }


}
