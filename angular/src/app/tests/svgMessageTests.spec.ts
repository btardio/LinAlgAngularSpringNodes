import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathaddfunctiontoolbarComponent } from '../mathaddfunctiontoolbar/mathaddfunctiontoolbar.component';

import * as dagre from 'dagre';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

import { MathtoptoolbarComponent } from '../mathtoptoolbar/mathtoptoolbar.component';
import { HideShowService } from '../hideshowservices.service';
import { MatrixService } from '../matrix-service.service';
import { NgZone, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
// import { MathsvgComponent } from '../mathsvg/mathsvg.component';
import { SvgRenderService } from '../svg-render-service.service';
import { MathaddmatrixtoolbarComponent } from '../mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { LinAlgMatrix } from '../matrix';
import { LinAlgFunction } from '../matrix-function';
import { Operenum } from '../operenum.enum';
import { SvgMessage } from '../svg-message';
import { MorF } from '../mor-f.enum';
import { SvgNodeMatrix } from '../svg-node';
import { SvgRenderable } from '../svg-node';
import { RenderableType } from '../renderable-type.enum';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatrixHttpClientService } from '../matrix-http-client.service';
import { SvgMessageType } from '../svg-message-type.enum';


describe('SvgMessage Tests > ', () => {
  let fixtureFunctionToolbar: ComponentFixture<MathaddfunctiontoolbarComponent>;
  let fixtureMatrixToolbar: ComponentFixture<MathaddmatrixtoolbarComponent>;
  let fixtureTopToolbar: ComponentFixture<MathtoptoolbarComponent>;
  let fixtureHttpClient: ComponentFixture<HttpClient>;
  
  let instanceTopToolbar: MathtoptoolbarComponent;
  let instanceFunctionToolbar: MathaddfunctiontoolbarComponent;
  let instanceMatrixToolbar: MathaddmatrixtoolbarComponent;
  
  let httpMock: HttpTestingController;
    
  let ngZone: NgZone;
    
  let svgRenderService: SvgRenderService;
  let hideshowservice: HideShowService;
  let matrixService: MatrixService;
  let matrixHttpClientService: MatrixHttpClientService;
  let compiled: any;
  let element: DebugElement;  
  
  let myMockWindow: Window;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
  declarations: [
    AppComponent,
    MathtoptoolbarComponent,
    MathaddmatrixtoolbarComponent,
    MathaddfunctiontoolbarComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientTestingModule
  ],
  providers: [      MathtoptoolbarComponent, 
                    HideShowService,
                    MatrixService, 
                    SvgRenderService,
                    MathaddfunctiontoolbarComponent,
                    MathaddmatrixtoolbarComponent,
                    MatrixHttpClientService
                   ],

    })
    .compileComponents();
  }));

  beforeEach(() => {

    hideshowservice = TestBed.get(HideShowService);
    matrixService = TestBed.get(MatrixService);
    svgRenderService = TestBed.get(SvgRenderService);
    matrixHttpClientService = TestBed.get(MatrixHttpClientService);
    httpMock = TestBed.get(HttpTestingController);

    fixtureTopToolbar = TestBed.createComponent(MathtoptoolbarComponent);
    instanceTopToolbar = fixtureTopToolbar.componentInstance;
    fixtureTopToolbar.detectChanges(); 

    fixtureMatrixToolbar = TestBed.createComponent(MathaddmatrixtoolbarComponent);
    instanceMatrixToolbar = fixtureMatrixToolbar.componentInstance;
    fixtureMatrixToolbar.detectChanges();   

    fixtureFunctionToolbar = TestBed.createComponent(MathaddfunctiontoolbarComponent);
    instanceFunctionToolbar = fixtureFunctionToolbar.componentInstance;
    fixtureFunctionToolbar.detectChanges();           
    
  });

  it('should create', () => {
    expect(fixtureTopToolbar).toBeTruthy();
    expect(fixtureMatrixToolbar).toBeTruthy();
    expect(fixtureFunctionToolbar).toBeTruthy();
  });
  
  
  it('mathsvg consumeSvgMessage works', () => {

    const addedmatrices: Array<number> = new Array<number>();
    const addedfunctions: Array<number> = new Array<number>();

    let n_addedmatrices = 0;
    let n_addedfunctions = 0;

    const n_iterations = 30;
    const n_insertions = n_iterations;

    // add matrices and functions
    for ( let i = 0; i < n_insertions; i++ ) {

      addedmatrices.push( instanceMatrixToolbar.clickAddMatrix().getId() );
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );

      addedfunctions.push( (<LinAlgFunction>instanceFunctionToolbar.clickAddFunctionAdd()[0]).getId() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );

    }



    const messagesArray: Array<SvgMessage> = new Array<SvgMessage>();

    // add messages emulating selecting a button
    for ( let i = 0; i < addedmatrices.length; i++ ) {
      messagesArray.push( new SvgMessage( addedmatrices[i], 'matrix', { checked: true }, SvgMessageType.Select ) );
    }
    for ( let i = 0; i < addedfunctions.length; i++ ) {
      messagesArray.push( new SvgMessage( addedfunctions[i], 'function', { checked: true }, SvgMessageType.Select ) );
    }

    for ( let i = 0; i < messagesArray.length; i++ ) {
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeFalsy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        expect( matrixService.getMatrixWithId(messagesArray[i].getId()).getSelected() ).toBeFalsy();
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        expect( matrixService.getFunctionWithId(messagesArray[i].getId()).getSelected() ).toBeFalsy();
      }
      expect(messagesArray[i].getElement().checked).toBeTruthy(); // check that the message is checked=true
      svgRenderService.consumeSvgMessage(messagesArray[i]);

      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeTruthy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        expect( matrixService.getMatrixWithId(messagesArray[i].getId()).getSelected() ).toBeTruthy();
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        expect( matrixService.getFunctionWithId(messagesArray[i].getId()).getSelected() ).toBeTruthy();
      }
    }

    while ( messagesArray.length > 0 ) { messagesArray.pop(); }

    // add messages emulating unselecting a button
    for ( let i = 0; i < addedmatrices.length; i++ ) {
      messagesArray.push( new SvgMessage( addedmatrices[i], 'matrix', { checked: false }, SvgMessageType.Select ) );
    }
    for ( let i = 0; i < addedfunctions.length; i++ ) {
      messagesArray.push( new SvgMessage( addedfunctions[i], 'function', { checked: false }, SvgMessageType.Select ) );
    }

    for ( let i = 0; i < messagesArray.length; i++ ) {
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeTruthy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        expect( matrixService.getMatrixWithId(messagesArray[i].getId()).getSelected() ).toBeTruthy();
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        expect( matrixService.getFunctionWithId(messagesArray[i].getId()).getSelected() ).toBeTruthy();
      }
      expect(messagesArray[i].getElement().checked).toBeFalsy(); // check that the message is checked=false
      svgRenderService.consumeSvgMessage(messagesArray[i]);
            expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeFalsy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        expect( matrixService.getMatrixWithId(messagesArray[i].getId()).getSelected() ).toBeFalsy();
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        expect( matrixService.getFunctionWithId(messagesArray[i].getId()).getSelected() ).toBeFalsy();
      }
    }

  });
  


    it('mathsvg render creates adequate nodes list', () => {


    const addedmatrices: Array<number> = new Array<number>();
    const addedfunctions: Array<number> = new Array<number>();

    let n_addedmatrices = 0;
    let n_addedfunctions = 0;

    const n_iterations = 10;
    const n_insertions = n_iterations;

    let m: LinAlgMatrix;
    let f: LinAlgFunction;

    for ( let i = 0; i < n_insertions; i++ ) {

      addedmatrices.push( instanceMatrixToolbar.clickAddMatrix().getId() );
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );

      addedfunctions.push( (<LinAlgFunction>instanceFunctionToolbar.clickAddFunctionAdd()[0]).getId() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );

    }

    const messagesArray: Array<SvgMessage> = new Array<SvgMessage>();

    // create messages emulating button clicks on nodes that are unchecked
    for ( let i = 0; i < addedmatrices.length; i++ ) {
      messagesArray.push( new SvgMessage( addedmatrices[i], 'matrix', { checked: true }, SvgMessageType.Select ) );
    }
    for ( let i = 0; i < addedfunctions.length; i++ ) {
      messagesArray.push( new SvgMessage( addedfunctions[i], 'function', { checked: true }, SvgMessageType.Select ) );
    }

    for ( let i = 0; i < messagesArray.length; i += 2 ) {
      svgRenderService.consumeSvgMessage(messagesArray[i]);
    }

    svgRenderService.render();

    for ( let i = 0; i < messagesArray.length; i += 2 ) {

      expect(messagesArray[i].getElement().checked).toBeTruthy();
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeTruthy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        m = matrixService.getMatrixWithId(messagesArray[i].getId());
        expect( m.getSelected() ).toBeTruthy();
        svgRenderService.svgRenderableContainer.matrices.forEach( node => {
          if ( node.id === m.getId() ) {
            expect( node.getLabel() ).toContain('checked="true"');
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgMatrixNode);
          }
        });
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        f = matrixService.getFunctionWithId(messagesArray[i].getId());
        expect( f.getSelected() ).toBeTruthy();
        svgRenderService.svgRenderableContainer.functions.forEach( node => {
          if ( node.id === f.getId() ) {
            expect( node.getLabel() ).toContain('checked="true"');
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgFunctionNode);
          }
        });

      }
      expect(messagesArray[i].getElement().checked ).toBeTruthy();
    }

    for ( let i = 1; i < messagesArray.length; i += 2 ) {
      expect(messagesArray[i].getElement().checked ).toBeTruthy();
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeFalsy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        m = matrixService.getMatrixWithId(messagesArray[i].getId());
        expect( m.getSelected() ).toBeFalsy();
        svgRenderService.svgRenderableContainer.matrices.forEach( node => {
          if ( node.id === m.getId() ) {
            expect( node.getLabel().indexOf('checked="true"') ).toBe(-1);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgMatrixNode);
          }
        });
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        f = matrixService.getFunctionWithId(messagesArray[i].getId());
        expect( f.getSelected() ).toBeFalsy();
        svgRenderService.svgRenderableContainer.functions.forEach( node => {
          if ( node.id === f.getId() ) {
            expect( node.getLabel().indexOf('checked="true"') ).toBe(-1);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgFunctionNode);
          }
        });
      }
      expect(messagesArray[i].getElement().checked ).toBeTruthy();

    }

      

    // emulate unchecking the same nodes
    while ( messagesArray.length > 0 ) { messagesArray.pop(); }

    for ( let i = 0; i < addedmatrices.length; i++ ) {
      messagesArray.push( new SvgMessage( addedmatrices[i], 'matrix', { checked: false }, SvgMessageType.Select ) );
    }
    for ( let i = 0; i < addedfunctions.length; i++ ) {
      messagesArray.push( new SvgMessage( addedfunctions[i], 'function', { checked: false }, SvgMessageType.Select ) );
    }

    for ( let i = 0; i < messagesArray.length; i += 2 ) {
      svgRenderService.consumeSvgMessage(messagesArray[i]);
    }

    svgRenderService.render();

    for ( let i = 0; i < messagesArray.length; i += 1 ) {
      expect(messagesArray[i].getElement().checked ).toBeFalsy();
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) ||
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeFalsy();
      if ( messagesArray[i].getMorf() === MorF.Matrix ) {
        m = matrixService.getMatrixWithId(messagesArray[i].getId());
        expect( m.getSelected() ).toBeFalsy();
        svgRenderService.svgRenderableContainer.matrices.forEach( node => {
          if ( node.id === m.getId() ) {
            expect( node.getLabel().indexOf('checked="true"') ).toBe(-1);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgMatrixNode);
          }
        });
      }
      else if ( messagesArray[i].getMorf() === MorF.Function ) {
        f = matrixService.getFunctionWithId(messagesArray[i].getId());
        expect( f.getSelected() ).toBeFalsy();
        svgRenderService.svgRenderableContainer.functions.forEach( node => {
          if ( node.id === f.getId() ) {
            expect( node.getLabel().indexOf('checked="true"') ).toBe(-1);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgFunctionNode);
          }
        });
      }
      expect(messagesArray[i].getElement().checked ).toBeFalsy();

    }
      
  });
  
  
});
    // test 
    // test renderSignal.subscribe
    // test nodes: Array<SvgNode>;
    //svgRenderService.
  
  







