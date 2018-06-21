import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MathaddfunctiontoolbarComponent } from './mathaddfunctiontoolbar.component';

import * as dagre from 'dagre';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

import { MathtoptoolbarComponent } from '../mathtoptoolbar/mathtoptoolbar.component';
import { HideShowService } from '../hideshowservices.service';
import { MatrixService } from '../matrix-service.service';
import { NgZone, DebugElement }    from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
//import { MathsvgComponent } from '../mathsvg/mathsvg.component';
import { SvgRenderServiceService } from '../svg-render-service.service';
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

describe('MathaddfunctiontoolbarComponent', () => {
  // let component: MathaddfunctiontoolbarComponent;
  let fixtureFunctionToolbar: ComponentFixture<MathaddfunctiontoolbarComponent>;
  let fixtureMatrixToolbar: ComponentFixture<MathaddmatrixtoolbarComponent>;
  let fixtureTopToolbar: ComponentFixture<MathtoptoolbarComponent>;
  let fixtureHttpClient: ComponentFixture<HttpClient>;
  // let fixtureMathsvg: ComponentFixture<MathsvgComponent>;
  
  let instanceTopToolbar: MathtoptoolbarComponent;
  let instanceFunctionToolbar: MathaddfunctiontoolbarComponent;
  let instanceMatrixToolbar: MathaddmatrixtoolbarComponent;
  // let instanceHttpClient: HttpClient;
  
  let httpMock: HttpTestingController;
  
  // let instanceMathsvg: MathSvgComponent;
    
  let ngZone: NgZone;
    
  let svgRenderService: SvgRenderServiceService;
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
    // MathsvgComponent,
    MathaddfunctiontoolbarComponent,
    
    
    
    
  ],
  imports: [
    BrowserModule,
    // HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientTestingModule
    // MathtoptoolbarModule
    // MathtoptoolbarComponent,
    // MathaddmatrixtoolbarComponent,
    // MathaddfunctiontoolbarComponent
  ],
  providers: [      MathtoptoolbarComponent, 
                    HideShowService,
                    MatrixService, 
                    SvgRenderServiceService,
                    MathaddfunctiontoolbarComponent,
                    MathaddmatrixtoolbarComponent,
                    MatrixHttpClientService
                   // {provide: Window, useValue: myMockWindow}
                   // NgZone
                   // MathsvgComponent
                   ],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    
    hideshowservice = TestBed.get(HideShowService);
    matrixService = TestBed.get(MatrixService);
    svgRenderService = TestBed.get(SvgRenderServiceService);
    matrixHttpClientService = TestBed.get(MatrixHttpClientService);
    //instanceHttpClient = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
    
    console.log('!@#$!@#$!@#$: ' + httpMock);
    
    // fixtureHttpClient = TestBed.createComponent(HttpClient);
    // instanceHttpClient = fixtureHttpClient.componentInstance;

    
    fixtureTopToolbar = TestBed.createComponent(MathtoptoolbarComponent);
    instanceTopToolbar = fixtureTopToolbar.componentInstance;
    fixtureTopToolbar.detectChanges(); 
    
    fixtureMatrixToolbar = TestBed.createComponent(MathaddmatrixtoolbarComponent);
    instanceMatrixToolbar = fixtureMatrixToolbar.componentInstance;
    fixtureMatrixToolbar.detectChanges();   
        
    fixtureFunctionToolbar = TestBed.createComponent(MathaddfunctiontoolbarComponent);
    instanceFunctionToolbar = fixtureFunctionToolbar.componentInstance;
    fixtureFunctionToolbar.detectChanges();           
    
    // addProviders([]);
    
    // instanceNgZone = new NgZone();
    
    // fixtureMathsvg = TestBed.createComponent(MathsvgComponent);
    //instanceMathsvg = fixtureMathsvg.componentInstance;
    //fixtureMathsvg.detectChanges();

    //compiled = fixture.debugElement.nativeElement;
    
    //element = fixture.debugElement;
    
    
  });

  it('should create', () => {
    expect(fixtureTopToolbar).toBeTruthy();
    expect(fixtureMatrixToolbar).toBeTruthy();
    expect(fixtureFunctionToolbar).toBeTruthy();
  });
  
  
  it('add delete functions works', () => {
    // console.log ( element('.value-entry input').is(':visible')).toBe(true) );
    // console.log ( element.query( By.css('#boolhiddenaddfunctionid') ) );
    
    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 30;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.finished() );    
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
      addedfunctions.push( <number>instanceFunctionToolbar.clickadd() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );
    }
    

    
    let rnum: number = Math.floor( Math.random() * 100 );
    
    let c_removedMatrices = 0;
    let c_removedFunctions = 0;
    
    while ( c_removedMatrices + c_removedFunctions < n_addedfunctions + n_addedmatrices ){
            
      if ( c_removedMatrices < n_addedmatrices && Math.random() < 0.5 ) {
          
          let removepos = Math.floor( Math.random() * addedmatrices.length );
          let removeid = addedmatrices[removepos];
          addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
          matrixService.addSelectedMatrix(removeid);
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 1 );
          matrixService.deleteSelectedMatrices();
          c_removedMatrices++;
          expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 0 );          
          
      }    
      else if ( c_removedFunctions < n_addedfunctions ) {
          
          let removepos = Math.floor( Math.random() * addedfunctions.length );
          let removeid = addedfunctions[removepos];
          addedfunctions = addedfunctions.slice(0,removepos).concat(addedfunctions.slice(removepos+1,addedfunctions.length));
          matrixService.addSelectedFunction(removeid);
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual( 1 );
          matrixService.deleteSelectedFunctions();
          c_removedFunctions++;
          expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions - c_removedFunctions );
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual( 0 );        
          
      }
      
    }
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );
    expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( 0 );

    
  });
  

  
  
  
  it('add three matrices, delete two, delete one works', () => {
    // console.log ( element('.value-entry input').is(':visible')).toBe(true) );
    // console.log ( element.query( By.css('#boolhiddenaddfunctionid') ) );
    
    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 30;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    let c_removedMatrices = 0;
        
    addedmatrices.push( instanceMatrixToolbar.finished() );    
    n_addedmatrices++;
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
    addedmatrices.push( instanceMatrixToolbar.finished() );    
    n_addedmatrices++;
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
    addedmatrices.push( instanceMatrixToolbar.finished() );    
    n_addedmatrices++;
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );

    // select 1 and 2
    
    let removepos = Math.floor( Math.random() * addedmatrices.length );
    let removeid = addedmatrices[removepos];
    addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
    matrixService.addSelectedMatrix(removeid);
    expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 1 );  
      
    removepos = Math.floor( Math.random() * addedmatrices.length );
    removeid = addedmatrices[removepos];
    addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
    matrixService.addSelectedMatrix(removeid);
    expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 2 );        
    
    // remove 1 and 2
    
    matrixService.deleteSelectedMatrices();
    c_removedMatrices++; c_removedMatrices++;    
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
    expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 0 );          
    
    // select 3
    
    removepos = Math.floor( Math.random() * addedmatrices.length );
    removeid = addedmatrices[removepos];
    addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
    matrixService.addSelectedMatrix(removeid);
    expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 1 );        
    
    // remove 3
    
    matrixService.deleteSelectedMatrices();
    c_removedMatrices++;
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
    expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 0 );              
    

    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );

    expect( matrixService.getMatrices().length ).toEqual( 0 );
    
    
  });  
  

  
  
  
  it('container changed signal works', () => {

    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 3;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    let c_containerChanged: number = 0;
    
    matrixService.containerChanged$.subscribe(nullvar => { 
    
      c_containerChanged++;
    
     } );
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.finished() );    
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
      expect( c_containerChanged ).toEqual(n_addedmatrices + n_addedfunctions);
    
      addedfunctions.push( <number>instanceFunctionToolbar.clickadd() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );
      
      expect( c_containerChanged ).toEqual( n_addedmatrices + n_addedfunctions );
    }
    
    let rnum: number = Math.floor( Math.random() * 100 );
    
    let c_removedMatrices = 0;
    let c_removedFunctions = 0;
    
    c_containerChanged = 0;
    
    while ( c_removedMatrices + c_removedFunctions < n_addedfunctions + n_addedmatrices ){
            
      if ( c_removedMatrices < n_addedmatrices && Math.random() < 0.5 ) {
          
          let removepos = Math.floor( Math.random() * addedmatrices.length );
          let removeid = addedmatrices[removepos];
          addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
          matrixService.addSelectedMatrix(removeid);
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual ( 1 );
          matrixService.deleteSelectedMatrices();
          c_removedMatrices++;
          expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual ( 0 );          
          
      }    
      else if ( c_removedFunctions < n_addedfunctions ) {
          
          let removepos = Math.floor( Math.random() * addedfunctions.length );
          let removeid = addedfunctions[removepos];
          addedfunctions = addedfunctions.slice(0,removepos).concat(addedfunctions.slice(removepos+1,addedfunctions.length));
          matrixService.addSelectedFunction(removeid);
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual ( 1 );
          matrixService.deleteSelectedFunctions();
          c_removedFunctions++;
          expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions - c_removedFunctions );
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual ( 0 );        
          
      }
      
      expect( c_containerChanged ).toEqual( c_removedFunctions + c_removedMatrices )
      
    }
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );
    expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( 0 );

  });
  
  
  it('selectedMatricesChanged and selectedFunctionsChanged changed signal works', () => {

    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 1;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    let c_selectedMatricesChanged: number = 0;
    let c_selectedFunctionsChanged: number = 0;
    
    let c_selectedMatrices = 0;
    let c_selectedFunctions = 0;    
    
    let c_removedMatrices = 0;
    let c_removedFunctions = 0;    
    
    matrixService.selectedMatricesChanged$.subscribe(varMatrixServiceService => { 
    
      c_selectedMatricesChanged++;
    
     } );
    
    matrixService.selectedFunctionsChanged$.subscribe(varMatrixServiceService => { 
    
      c_selectedFunctionsChanged++;
    
     } );
    
    
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.finished() );    
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
      
      // finished()-> addMatrix_aas calls clearSelectedAll
      c_selectedMatrices++;
      c_selectedFunctions++;
    
      expect( c_selectedMatricesChanged ).toEqual(c_selectedMatrices);
      expect( c_selectedFunctionsChanged ).toEqual( c_selectedFunctions );    
    
      addedfunctions.push( <number>instanceFunctionToolbar.clickadd() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );
      
      // clickadd()-> addFunction calls clearSelected
      c_selectedMatrices++;
      c_selectedFunctions++;
      
      expect( c_selectedMatricesChanged ).toEqual(c_selectedMatrices);
      expect( c_selectedFunctionsChanged ).toEqual( c_selectedFunctions );
    }


    

    // c_containerChanged = 0;
    
    while ( c_removedMatrices + c_removedFunctions < n_addedfunctions + n_addedmatrices ){
            
      if ( c_removedMatrices < n_addedmatrices && Math.random() < 0.5 ) {
          
          let removepos = Math.floor( Math.random() * addedmatrices.length );
          let removeid = addedmatrices[removepos];
          addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
          matrixService.addSelectedMatrix(removeid);
          c_selectedMatrices++;
          expect( c_selectedMatricesChanged ).toEqual(c_selectedMatrices);
          expect( c_selectedFunctionsChanged ).toEqual( c_selectedFunctions );
          console.log('c_selectedMatricesChanged:' + c_selectedMatricesChanged);
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual ( 1 );
          matrixService.deleteSelectedMatrices();
          c_removedMatrices++;
          console.log('c_selectedMatricesChanged:' + c_selectedMatricesChanged);
          c_selectedMatrices++; 
          expect( c_selectedMatricesChanged ).toEqual(c_selectedMatrices);
          expect( c_selectedFunctionsChanged ).toEqual( c_selectedFunctions );
          expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual ( 0 );          
          
      }    
      else if ( c_removedFunctions < n_addedfunctions ) {
          
          let removepos = Math.floor( Math.random() * addedfunctions.length );
          let removeid = addedfunctions[removepos];
          addedfunctions = addedfunctions.slice(0,removepos).concat(addedfunctions.slice(removepos+1,addedfunctions.length));
          matrixService.addSelectedFunction(removeid);
          c_selectedFunctions++;
          expect( c_selectedMatricesChanged ).toEqual(c_selectedMatrices);
          expect( c_selectedFunctionsChanged ).toEqual( c_selectedFunctions );
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual ( 1 );
          matrixService.deleteSelectedFunctions();
          c_removedFunctions++;
          c_selectedFunctions++;
          expect( c_selectedMatricesChanged ).toEqual(c_selectedMatrices);
          expect( c_selectedFunctionsChanged ).toEqual( c_selectedFunctions );    
          expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions - c_removedFunctions );
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual ( 0 );        
          
      }
      
      // expect( c_containerChanged ).toEqual( c_removedFunctions + c_removedMatrices + n_insertions );
      
    }
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );
    expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( 0 );

  });  
  
  it('availableids works', () => {

    let idsarray: Array<number> = new Array<number>();
    
    let rid = -1;
    
    let n_insertions = 100;
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
    
    
      switch ( Math.floor( (Math.random() * 2) ) ) {
          
        case 0: {
          rid = matrixService.addMatrix( new LinAlgMatrix( [[1,2],[3,4]] ) );
          idsarray.push(rid);
          expect(idsarray.filter( num => num == rid ).length).toBe( 1 );
          break;
        }
        
        case 1: {
          let f: LinAlgFunction = new LinAlgFunction( Operenum.Add );
          
          rid = <number>matrixService.addFunction( f );
          idsarray.push(rid);
          expect(idsarray.filter( num => num == rid ).length).toBe( 1 );
          break;
        }
  
      }
      
    }
  
  });
  
  it('mathsvg toggledSvg toggle works', () => {
    

    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    let n_iterations: number = 5;
    let n_insertions = n_iterations;
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.finished() );    
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices ); 
    
      addedfunctions.push( <number>instanceFunctionToolbar.clickadd() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );
      
    }  
  
    const messagesArray: Array<SvgMessage> = new Array<SvgMessage>();
  
    
  
    for ( let i = 0; i < addedmatrices.length; i++ ) {
      messagesArray.push( new SvgMessage( addedmatrices[i], 'matrix', { textContent: 'Select' } ) );
    }
    for ( let i = 0; i < addedfunctions.length; i++ ) {
      messagesArray.push( new SvgMessage( addedfunctions[i], 'function', { textContent: 'Select' } ) );
    }
  
    for ( let i = 0; i < messagesArray.length; i++ ) {
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) || 
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeFalsy();
      if ( messagesArray[i].getMorf() == MorF.Matrix ) {
        expect( matrixService.getMatrixWithId(messagesArray[i].getId()).selected ).toBeFalsy();
      }
      else if ( messagesArray[i].getMorf() == MorF.Function ) {
        expect( matrixService.getFunctionWithId(messagesArray[i].getId()).selected ).toBeFalsy();
      }
      expect(messagesArray[i].getElement().textContent).toEqual( 'Select' );
      svgRenderService.toggle(messagesArray[i]);
      expect(messagesArray[i].getElement().textContent).toEqual( 'Select (Selected)' );
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) || 
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeTruthy();
      if ( messagesArray[i].getMorf() == MorF.Matrix ) {
        expect( matrixService.getMatrixWithId(messagesArray[i].getId()).selected ).toBeTruthy();
      }
      else if ( messagesArray[i].getMorf() == MorF.Function ) {
        expect( matrixService.getFunctionWithId(messagesArray[i].getId()).selected ).toBeTruthy();
      }      
    }
   
  });
  
    it('mathsvg render creates adequate nodes list', () => {
    

    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    let n_iterations: number = 10;
    let n_insertions = n_iterations;
    
    let m: LinAlgMatrix;
    let f: LinAlgFunction;
    let io: number;
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.finished() );    
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices ); 
    
      addedfunctions.push( <number>instanceFunctionToolbar.clickadd() );
      n_addedfunctions++;
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );
      
    }  
  
    const messagesArray: Array<SvgMessage> = new Array<SvgMessage>();
  
    for ( let i = 0; i < addedmatrices.length; i++ ) {
      messagesArray.push( new SvgMessage( addedmatrices[i], 'matrix', { textContent: 'Select' } ) );
    }
    for ( let i = 0; i < addedfunctions.length; i++ ) {
      messagesArray.push( new SvgMessage( addedfunctions[i], 'function', { textContent: 'Select' } ) );
    }
  
    for ( let i = 0; i < messagesArray.length; i+=2 ) {
      svgRenderService.toggle(messagesArray[i]);
    }
   
    svgRenderService.render();
   
    for ( let i = 0; i < messagesArray.length; i+=2 ) {

      expect(messagesArray[i].getElement().textContent).toEqual( 'Select (Selected)' );
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) || 
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeTruthy();
      if ( messagesArray[i].getMorf() == MorF.Matrix ) {
        m = matrixService.getMatrixWithId(messagesArray[i].getId());
        expect( m.selected ).toBeTruthy();
        svgRenderService.nodes.forEach( node => { 
          if ( node.id === m.id ) {
            expect( node.getSelectedText() ).toMatch(/^Select \(Selected\)$/);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgMatrixNode);
          }
        });
      }
      else if ( messagesArray[i].getMorf() == MorF.Function ) {
        f = matrixService.getFunctionWithId(messagesArray[i].getId());
        expect( f.selected ).toBeTruthy();
        svgRenderService.nodes.forEach( node => { 
          if ( node.id === f.id ) {
            expect( node.getSelectedText() ).toMatch(/^Select \(Selected\)$/);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgFunctionNode);
          }
        });
        
      }      
      
    }   
   
    for ( let i = 1; i < messagesArray.length; i+=2 ) {
      expect( matrixService.getSelectedMatricesAsLinkedList().contains( messagesArray[i].getId() ) || 
              matrixService.getSelectedFunctionsAsLinkedList().contains( messagesArray[i].getId() ) ).toBeFalsy();
      if ( messagesArray[i].getMorf() == MorF.Matrix ) {
        m = matrixService.getMatrixWithId(messagesArray[i].getId());
        expect( m.selected ).toBeFalsy();
        svgRenderService.nodes.forEach( node => { 
          if ( node.id === m.id ) {
            expect( node.getSelectedText() ).toMatch(/^Select$/);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgMatrixNode);
          }
        });
      }
      else if ( messagesArray[i].getMorf() == MorF.Function ) {
        f = matrixService.getFunctionWithId(messagesArray[i].getId());
        expect( f.selected ).toBeFalsy();
        svgRenderService.nodes.forEach( node => { 
          if ( node.id === f.id ) {
            expect( node.getSelectedText() ).toMatch(/^Select$/);
            expect( node.getRenderableType() ).toEqual(RenderableType.SvgFunctionNode);
          }
        });
      }
      expect(messagesArray[i].getElement().textContent).toEqual( 'Select' );

    }
   
  });
  
  it('mathsvg Array<SvgNode> and render works', () => {
    
    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 3;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    let c_containerChanged: number = 0;
    
    let c_removedMatrices = 0;
    let c_removedFunctions = 0;    
    
    matrixService.containerChanged$.subscribe(nullvar => { 
    
      c_containerChanged++;
    
      
    
     } );
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.finished() );    
      n_addedmatrices++;
      expect(svgRenderService.nodes.length).toEqual( n_addedmatrices + n_addedfunctions - c_removedFunctions - c_removedMatrices);
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
      expect( c_containerChanged ).toEqual(n_addedmatrices + n_addedfunctions);
    
      addedfunctions.push( <number>instanceFunctionToolbar.clickadd() );
      n_addedfunctions++;
      expect(svgRenderService.nodes.length).toEqual( n_addedmatrices + n_addedfunctions - c_removedFunctions - c_removedMatrices);
      expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions );
      
      expect( c_containerChanged ).toEqual( n_addedmatrices + n_addedfunctions );
    }
    
    let rnum: number = Math.floor( Math.random() * 100 );
    

    
    c_containerChanged = 0;
    
    while ( c_removedMatrices + c_removedFunctions < n_addedfunctions + n_addedmatrices ){
            
      if ( c_removedMatrices < n_addedmatrices && Math.random() < 0.5 ) {
          
          let removepos = Math.floor( Math.random() * addedmatrices.length );
          let removeid = addedmatrices[removepos];
          addedmatrices = addedmatrices.slice(0,removepos).concat(addedmatrices.slice(removepos+1,addedmatrices.length));
          matrixService.addSelectedMatrix(removeid);
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual ( 1 );
          matrixService.deleteSelectedMatrices();
          c_removedMatrices++;
          expect(svgRenderService.nodes.length).toEqual( n_addedmatrices + n_addedfunctions - c_removedFunctions - c_removedMatrices);
          expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
          expect( matrixService.getSelectedMatricesAsArray().length ).toEqual ( 0 );          
          
      }    
      else if ( c_removedFunctions < n_addedfunctions ) {
          
          let removepos = Math.floor( Math.random() * addedfunctions.length );
          let removeid = addedfunctions[removepos];
          addedfunctions = addedfunctions.slice(0,removepos).concat(addedfunctions.slice(removepos+1,addedfunctions.length));
          matrixService.addSelectedFunction(removeid);
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual ( 1 );
          matrixService.deleteSelectedFunctions();
          c_removedFunctions++;
          expect(svgRenderService.nodes.length).toEqual( n_addedmatrices + n_addedfunctions - c_removedFunctions - c_removedMatrices);
          expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions - c_removedFunctions );
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual ( 0 );        
          
      }
      
      expect( c_containerChanged ).toEqual( c_removedFunctions + c_removedMatrices )
      
    }
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );
    expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( 0 );    
    
  });
  

  xit('edge swap', () => {
    
    // check that the edge in LL in function agrees with the edge in LL in mat-func-container
    // whenever swapping
    
  });
  
});
    // test 
    // test renderSignal.subscribe
    // test nodes: Array<SvgNode>;
    //svgRenderService.
  
  







