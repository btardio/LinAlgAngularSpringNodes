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

  // matfunccontainer, render, message and signals
describe('MatFuncContainer Tests > ', () => {
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
                    SvgRenderService,
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
  
  
  it('add delete functions works', () => {
    
    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 30;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
      addedmatrices.push( instanceMatrixToolbar.clickAddMatrix().getId() );    
      n_addedmatrices++;
      expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
      addedfunctions.push( (<LinAlgFunction>instanceFunctionToolbar.clickAddFunctionAdd()[0]).getId() );
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
          // matrixService.deleteSelectedMatrices();
          instanceTopToolbar.erase();
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
          // matrixService.deleteSelectedFunctions();
          instanceTopToolbar.erase();
          c_removedFunctions++;
          expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( n_addedfunctions - c_removedFunctions );
          expect( matrixService.getSelectedFunctionsAsArray().length ).toEqual( 0 );        
          
      }
      
    }
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );
    expect( matrixService.getMatFuncContainer().getFunctionsLength() ).toEqual( 0 );

    
  });
  

  
  
  
  it('add three matrices, delete two, delete one works', () => {
    
    let addedmatrices: Array<number> = new Array<number>();
    let addedfunctions: Array<number> = new Array<number>();
    
    let n_insertions:number = 30;
    
    let n_addedmatrices:number = 0;
    let n_addedfunctions:number = 0;
    let c_removedMatrices = 0;
        
    addedmatrices.push( instanceMatrixToolbar.clickAddMatrix().getId() );    
    n_addedmatrices++;
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
    addedmatrices.push( instanceMatrixToolbar.clickAddMatrix().getId() );    
    n_addedmatrices++;
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices );
    
    addedmatrices.push( instanceMatrixToolbar.clickAddMatrix().getId() );    
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
    
    //matrixService.deleteSelectedMatrices();
    instanceTopToolbar.erase();
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
    
    //matrixService.deleteSelectedMatrices();
    instanceTopToolbar.erase();
    c_removedMatrices++;
    
    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( n_addedmatrices - c_removedMatrices );
    expect( matrixService.getSelectedMatricesAsArray().length ).toEqual( 0 );              
    

    expect( matrixService.getMatFuncContainer().getMatricesLength() ).toEqual( 0 );

    expect( matrixService.getMatrices().length ).toEqual( 0 );
    
    
  });  
  

  
  
  
  it('availableids works', () => {

    let idsarray: Array<number> = new Array<number>();
    
    let rid = -1;
    
    let n_insertions = 100;
    
    for ( let i = 0; i < n_insertions; i++ ) {
    
    
    
      switch ( Math.floor( (Math.random() * 2) ) ) {
          
        case 0: {
          rid = matrixService.addMatrix( new LinAlgMatrix( [[1,2],[3,4]] ) ).getId();
          idsarray.push(rid);
          expect(idsarray.filter( num => num == rid ).length).toBe( 1 );
          break;
        }
        
        case 1: {
          let f: LinAlgFunction = new LinAlgFunction( Operenum.Add );
          
          rid = (<LinAlgFunction>matrixService.addFunction( f )[0]).getId();
          idsarray.push(rid);
          expect(idsarray.filter( num => num == rid ).length).toBe( 1 );
          break;
        }
  
      }
      
    }
  
  });
  
  
  

  
  

  


  
});
    // test 
    // test renderSignal.subscribe
    // test nodes: Array<SvgNode>;
    //svgRenderService.
  
  







