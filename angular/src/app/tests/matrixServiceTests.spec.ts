import { TestBed, inject } from '@angular/core/testing';

import { async, ComponentFixture } from '@angular/core/testing';

import { MathaddfunctiontoolbarComponent } from '../mathaddfunctiontoolbar/mathaddfunctiontoolbar.component';

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
import { SvgRenderService } from '../svg-render-service.service';
import { MathaddmatrixtoolbarComponent } from '../mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { LinAlgMatrix } from '../matrix';
import { LinAlgFunction } from '../matrix-function';
import { Operenum } from '../operenum.enum';
import { SvgMessage } from '../svg-message';
import { Bag as basBag } from 'typescript-collections';
import { LinAlgEdge } from '../edge';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatrixHttpClientService } from '../matrix-http-client.service';
import { TestHelperClass } from './testHelperClass';

describe('MatrixService Tests', () => {

  let fixtureFunctionToolbar: ComponentFixture<MathaddfunctiontoolbarComponent>;
  let fixtureMatrixToolbar: ComponentFixture<MathaddmatrixtoolbarComponent>;
  let fixtureTopToolbar: ComponentFixture<MathtoptoolbarComponent>;
  
  let instanceTopToolbar: MathtoptoolbarComponent;
  let instanceFunctionToolbar: MathaddfunctiontoolbarComponent;
  let instanceMatrixToolbar: MathaddmatrixtoolbarComponent;
    
  let httpMock: HttpTestingController;
    
  let matrixHttpClientService: MatrixHttpClientService;
  
  let ngZone: NgZone;
    
  let svgRenderService: SvgRenderService;
  let hideshowservice: HideShowService;
  let matrixService: MatrixService;
  let compiled: any;
  let element: DebugElement;  
  
  let myMockWindow: Window;
  
  
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
  declarations: [
    AppComponent,
    MathtoptoolbarComponent,
    MathaddmatrixtoolbarComponent,
    MathaddfunctiontoolbarComponent
    
    
    
    
  ],
  imports: [
    BrowserModule,
    // HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientTestingModule
  ],
  providers: [MathtoptoolbarComponent, 
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
  
  
  it('add delete nodes', () => {
    
    instanceMatrixToolbar.setMatrix([[1,2,0], [0,3,1]]);
    
    // add two matrices 1 function, remove and readadd function
    let a:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
    let b:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
    matrixService.addSelectedMatrix(a);
    matrixService.addSelectedMatrix(b);
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    const addedFunctions: Array<number> = new Array<number>();
    
    let newFunction: LinAlgFunction;
    let newMatrix: LinAlgMatrix;
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newMatrix = <LinAlgMatrix>morf; 
      }
      if ( morf instanceof LinAlgFunction ) {
        newFunction = <LinAlgFunction>morf;
      }
    });
    
    expect( newFunction instanceof LinAlgFunction ).toBeTruthy();
    addedFunctions.push( newFunction.getId() );
  
    {
    // expect three edges, three matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(3);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(3);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    { 
    // expect zero edges, three matrices, zero functions
    matrixService.addSelectedFunction( addedFunctions[0] );
    instanceTopToolbar.erase();
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(3);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(0);
    }
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }

  });
  
  
   

  it('add delete nodes 2', () => {
    
    instanceMatrixToolbar.setMatrix([[1,2,0], [0,3,1]]);
    
    // add two matrices 1 function, remove and readadd function
    let a:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
    let b:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
    let d:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
    
    matrixService.addSelectedMatrix(a);
    matrixService.addSelectedMatrix(b);
    matrixService.addSelectedMatrix(d);
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    const addedFunctions: Array<number> = new Array<number>();
    
    let newFunction: LinAlgFunction;
    let newMatrix: LinAlgMatrix;
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newMatrix = <LinAlgMatrix>morf; 
      }
      if ( morf instanceof LinAlgFunction ) {
        newFunction = <LinAlgFunction>morf;
      }
    });
    
    expect( newFunction instanceof LinAlgFunction ).toBeTruthy();
    addedFunctions.push( newFunction.getId() );
    
    {
    // expect four edges, four matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(4);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(4);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    { 
    // expect zero edges, three matrices, zero functions
    matrixService.addSelectedFunction( addedFunctions[0] );
    instanceTopToolbar.erase();
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(4);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(0);
    }  
  });
  

  
  it('add connected nodes', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(3, instanceMatrixToolbar);
    TestHelperClass.selectRandomMatrices(3, addedMatrices, matrixService);
    
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    
    {
    // expect four edges, four matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(4);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(4);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    
    let newFunction: LinAlgFunction;
    let newMatrix: LinAlgMatrix;
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newMatrix = <LinAlgMatrix>morf; 
      }
      if ( morf instanceof LinAlgFunction ) {
        newFunction = <LinAlgFunction>morf;
      }
    });
    
    matrixService.addSelectedFunction( newFunction.getId() );
    addedMatrices = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    matrixService.addSelectedFunction( newFunction.getId() );
    addedMatrices = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    matrixService.addSelectedFunction( newFunction.getId() );
    addedMatrices = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    
    {
    // expect seven edges, seven matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(7);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(7);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    
    for ( let i = 0; i < 10; i++ ) {
      
      matrixService.addSelectedMatrix( newMatrix.getId() );
      
      addedFromAddFunction = instanceFunctionToolbar.clickAddFunctionAdd();
      
      addedFromAddFunction.forEach( morf => {
        if ( morf instanceof LinAlgMatrix ) {
          newMatrix = <LinAlgMatrix>morf; 
        }
        if ( morf instanceof LinAlgFunction ) {
          newFunction = <LinAlgFunction>morf;
        }
      });    
      
      {
      // expect nine edges, eight matrices, two functions
      let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
      expect(edgesBag.size()).toEqual(9 + 2 * i);
      let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
      expect(matrices.length).toEqual(8 + i);
      let functions: Array<LinAlgFunction> = matrixService.getFunctions();
      expect(functions.length).toEqual(2 + i);
      }
      
      matrixService.addSelectedFunction( newFunction.getId() );
      
    }
    
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
    
    
  });
  
  
  it('add connected nodes', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(3, instanceMatrixToolbar);
    TestHelperClass.selectRandomMatrices(3, addedMatrices, matrixService);
    
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    
    {
    // expect four edges, four matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(4);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(4);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    
    let newFunction: LinAlgFunction;
    let newMatrix: LinAlgMatrix;
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newMatrix = <LinAlgMatrix>morf; 
      }
      if ( morf instanceof LinAlgFunction ) {
        newFunction = <LinAlgFunction>morf;
      }
    });
    
    matrixService.addSelectedFunction( newFunction.getId() );
    addedMatrices = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    matrixService.addSelectedFunction( newFunction.getId() );
    addedMatrices = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    matrixService.addSelectedFunction( newFunction.getId() );
    addedMatrices = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    
    {
    // expect seven edges, seven matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(7);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(7);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    
    for ( let i = 0; i < 10; i++ ) {
      
      matrixService.addSelectedMatrix( newMatrix.getId() );
      
      addedFromAddFunction = instanceFunctionToolbar.clickAddFunctionAdd();
      
      addedFromAddFunction.forEach( morf => {
        if ( morf instanceof LinAlgMatrix ) {
          newMatrix = <LinAlgMatrix>morf; 
        }
        if ( morf instanceof LinAlgFunction ) {
          newFunction = <LinAlgFunction>morf;
        }
      });    
      
      {
      // expect nine edges, eight matrices, two functions
      let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
      expect(edgesBag.size()).toEqual(9 + 2 * i);
      let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
      expect(matrices.length).toEqual(8 + i);
      let functions: Array<LinAlgFunction> = matrixService.getFunctions();
      expect(functions.length).toEqual(2 + i);
      }
      
      matrixService.addSelectedFunction( newFunction.getId() );
      
    }
    
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
    
    
    
  });
  
  
  it('4 matrices interconnected to 2 functions', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(4, instanceMatrixToolbar);
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    matrixService.addSelectedMatrix( addedMatrices[1].getId() );
    matrixService.addSelectedMatrix( addedMatrices[2].getId() );
    
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    
    let newFunctionA: LinAlgFunction;
    let newMatrixA: LinAlgMatrix;
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newMatrixA = <LinAlgMatrix>morf; 
      }
      if ( morf instanceof LinAlgFunction ) {
        newFunctionA = <LinAlgFunction>morf;
      }
    });
    

    {
    // expect four edges, four matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(4);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(5);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    
   
    
    matrixService.addSelectedMatrix( addedMatrices[1].getId() );
    matrixService.addSelectedMatrix( addedMatrices[2].getId() );
    matrixService.addSelectedMatrix( addedMatrices[3].getId() );
    
    addedFromAddFunction = instanceFunctionToolbar.clickAddFunctionAdd();
    
    let newFunctionB: LinAlgFunction;
    let newMatrixB: LinAlgMatrix;
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newMatrixB = <LinAlgMatrix>morf; 
      }
      if ( morf instanceof LinAlgFunction ) {
        newFunctionB = <LinAlgFunction>morf;
      }
    });
    
    {
    // expect 8 edges, 6 matrices, 2 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(8);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(6);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(2);
    }
    
    matrixService.addSelectedMatrix( addedMatrices[2].getId() );
    
    instanceTopToolbar.erase();
    
    {
    // expect 6 edges, 5 matrices, 2 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(6);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(5);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(2);
    }
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }

    
  });
  
  
  it('2 matrices interconnected to 4 functions', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(2, instanceMatrixToolbar);
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    matrixService.addSelectedMatrix( addedMatrices[1].getId() );
    
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    matrixService.addSelectedMatrix( addedMatrices[1].getId() );    
    
    addedFromAddFunction = addedFromAddFunction.concat(instanceFunctionToolbar.clickAddFunctionAdd());
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    matrixService.addSelectedMatrix( addedMatrices[1].getId() );    
    
    addedFromAddFunction = addedFromAddFunction.concat(instanceFunctionToolbar.clickAddFunctionAdd());
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    matrixService.addSelectedMatrix( addedMatrices[1].getId() );    
    
    addedFromAddFunction = addedFromAddFunction.concat(instanceFunctionToolbar.clickAddFunctionAdd());
    
    
    let newlyAddedFunctions: Array<LinAlgFunction> = new Array<LinAlgFunction>();
    let newlyAddedMatrices: Array<LinAlgMatrix> = new Array<LinAlgMatrix>();
    
    addedFromAddFunction.forEach( morf => {
      if ( morf instanceof LinAlgMatrix ) {
        newlyAddedMatrices.push(<LinAlgMatrix>morf); 
      }
      if ( morf instanceof LinAlgFunction ) {
        newlyAddedFunctions.push(<LinAlgFunction>morf);
      }
    });
    

    {
    // expect 12 edges, 6 matrices,4 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(12);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(6);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(4);
    }
    
    let selectedFunctions: Array<LinAlgFunction> = TestHelperClass.selectRandomFunctions(2, newlyAddedFunctions, matrixService);
    
    instanceTopToolbar.erase();
    
    {
    // expect 12 edges, 6 matrices,4 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(6);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(6);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(2);
    }
    
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
    
  });
  

  it('1 matrix, 1 function, add edge', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    let addedFunctions: Array<LinAlgFunction|LinAlgMatrix> = TestHelperClass.addFunctions(1, instanceFunctionToolbar);
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    
    expect( addedFunctions[0] instanceof LinAlgFunction ).toBeTruthy();
    
    matrixService.addSelectedFunction( (<LinAlgFunction>addedFunctions[0]).getId() );
    
    instanceTopToolbar.addEdge();
    
    {
    // expect 1 edges, 1 matrices, 1 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(1);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(1);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(1);
    }
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
  });
    
    
  it('1 matrix, 0 function, add edge, throws error', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    // let addedFunctions: Array<LinAlgFunction|LinAlgMatrix> = addFunctions(1);
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    
    // expect( addedFunctions[0] instanceof LinAlgFunction ).toBeTruthy();
    
    // matrixService.addSelectedFunction( (<LinAlgFunction>addedFunctions[0]).getId() );
    
    expect( function() { instanceTopToolbar.addEdge() } ).toThrowError();
    
    {
    // expect 0 edges, 1 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(1);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
    
  });
  
  
  it('1 matrix, 1 function, add edge, swap edge direction', () => {
    
    let addedMatrices: Array<LinAlgMatrix> = TestHelperClass.addMatrices(1, instanceMatrixToolbar);
    let addedFunctions: Array<LinAlgFunction|LinAlgMatrix> = TestHelperClass.addFunctions(1, instanceFunctionToolbar);
    
    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
    
    expect( addedFunctions[0] instanceof LinAlgFunction ).toBeTruthy();
    
    matrixService.addSelectedFunction( (<LinAlgFunction>addedFunctions[0]).getId() );
    
    instanceTopToolbar.addEdge();
    
    {
    // expect 1 edges, 1 matrices, 1 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(1);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(1);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(1);
    expect(edgesBag.toArray()[0].getIMF()).toEqual(matrices[0]);
    expect(edgesBag.toArray()[0].getJMF()).toEqual(functions[0]);
    expect(edgesBag.toArray()[0].getMatrixOfIJ()).toEqual(matrices[0]);
    expect(edgesBag.toArray()[0].getFunctionOfIJ()).toEqual(functions[0]);
    }
    
    instanceTopToolbar.selectAll();
    
    instanceTopToolbar.swapDirection();
    
    {
    // expect 1 edges, 1 matrices, 1 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(1);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(1);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(1);
    expect(edgesBag.toArray()[0].getIMF()).toEqual(functions[0]);
    expect(edgesBag.toArray()[0].getJMF()).toEqual(matrices[0]);
    expect(edgesBag.toArray()[0].getMatrixOfIJ()).toEqual(matrices[0]);
    expect(edgesBag.toArray()[0].getFunctionOfIJ()).toEqual(functions[0]);
    }
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();

    { // expect 0 edges, 0 matrices, 0 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
    }
  });
  
//    
//    
//    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
//    
//    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
//    matrixService.addSelectedMatrix( addedMatrices[1].getId() );    
//    
//    addedFromAddFunction = addedFromAddFunction.concat(instanceFunctionToolbar.clickAddFunctionAdd());
//    
//    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
//    matrixService.addSelectedMatrix( addedMatrices[1].getId() );    
//    
//    addedFromAddFunction = addedFromAddFunction.concat(instanceFunctionToolbar.clickAddFunctionAdd());
//    
//    matrixService.addSelectedMatrix( addedMatrices[0].getId() );
//    matrixService.addSelectedMatrix( addedMatrices[1].getId() );    
//    
//    addedFromAddFunction = addedFromAddFunction.concat(instanceFunctionToolbar.clickAddFunctionAdd());
//    
//    
//    let newlyAddedFunctions: Array<LinAlgFunction> = new Array<LinAlgFunction>();
//    let newlyAddedMatrices: Array<LinAlgMatrix> = new Array<LinAlgMatrix>();
//    
//    addedFromAddFunction.forEach( morf => {
//      if ( morf instanceof LinAlgMatrix ) {
//        newlyAddedMatrices.push(<LinAlgMatrix>morf); 
//      }
//      if ( morf instanceof LinAlgFunction ) {
//        newlyAddedFunctions.push(<LinAlgFunction>morf);
//      }
//    });
//    
//
//    {
//    // expect 12 edges, 6 matrices,4 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(12);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(6);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(4);
//    }
//    
//    let selectedFunctions: Array<LinAlgFunction> = selectRandomFunctions(2, newlyAddedFunctions);
//    
//    instanceTopToolbar.erase();
//    
//    {
//    // expect 12 edges, 6 matrices,4 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(6);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(6);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(2);
//    }
//    
//    
//    instanceTopToolbar.selectAll();
//    instanceTopToolbar.erase();
//
//    { // expect 0 edges, 0 matrices, 0 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges(); expect(edgesBag.size()).toEqual(0);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices(); expect(matrices.length).toEqual(0);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions(); expect(functions.length).toEqual(0);
//    }
    

  

//    
//    matrixService.addSelectedMatrix( addedMatrices[1].getId() );
//    matrixService.addSelectedMatrix( addedMatrices[2].getId() );
//    matrixService.addSelectedMatrix( addedMatrices[3].getId() );
//    
//    addedFromAddFunction = instanceFunctionToolbar.clickAddFunctionAdd();
//    
//    let newFunctionB: LinAlgFunction;
//    let newMatrixB: LinAlgMatrix;
//    
//    addedFromAddFunction.forEach( morf => {
//      if ( morf instanceof LinAlgMatrix ) {
//        newMatrixB = <LinAlgMatrix>morf; 
//      }
//      if ( morf instanceof LinAlgFunction ) {
//        newFunctionB = <LinAlgFunction>morf;
//      }
//    });
//    
//    {
//    // expect 8 edges, 6 matrices, 2 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(8);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(6);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(2);
//    }
//    
//    matrixService.addSelectedMatrix( addedMatrices[2].getId() );
//    
//    instanceTopToolbar.erase();
//    
//    {
//    // expect 6 edges, 5 matrices, 2 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(6);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(5);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(2);
//    }
    
    // matrixService.addSelectedFunction( newFunction.getId() );
  
//    console.log( addMatricesAtRandom() );
//    
//    instanceMatrixToolbar.matrix = [['1','2','0'], ['0','3','1']];
//    
//    // add two matrices 1 function, remove and readadd function
//    let a:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
//    let b:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
//    let d:number = <number>instanceMatrixToolbar.clickAddMatrix().getId();
//    
//    matrixService.addSelectedMatrix(a);
//    matrixService.addSelectedMatrix(b);
//    matrixService.addSelectedMatrix(d);
//    let c: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
//    const addedFunctions: Array<number> = new Array<number>();
//    
//    expect( c[0] instanceof LinAlgFunction ).toBeTruthy();
//    addedFunctions.push( (<LinAlgFunction>c[0]).getId() );
//    
//    {
//    // expect four edges, four matrices, one function
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(4);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(4);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(1);
//    }
//    { 
//    // expect zero edges, three matrices, zero functions
//    matrixService.addSelectedFunction( addedFunctions[0] );
//    instanceTopToolbar.erase();
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(0);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(4);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(0);
//    }  
  
  
//    
//    instanceTopToolbar.selectAll();
//    instanceTopToolbar.erase();
//     
//    {
//    // add two matrices 1 function, remove matrix
//    let a:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    matrixService.addSelectedMatrix(a);
//    let c:number = <number>instanceFunctionToolbar.clickAddFunctionAdd();
//    {
//    // expect one edges, one matrices, one function
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(1);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(1);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(1);
//    expect(matrixService.getSelectedMatricesAsLinkedList().size()).toEqual(0);
//    expect(matrixService.getSelectedFunctionsAsLinkedList().size()).toEqual(0);
//    }
//    { 
//    // expect zero edges, one matrices, zero functions
//    matrixService.addSelectedFunction(c);
//    instanceTopToolbar.erase();
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(0);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(1);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(0);
//    }
//    }
//    
//    instanceTopToolbar.selectAll();
//    instanceTopToolbar.erase();
//    
//    {
//    // add 3 matrices 2 functions, remove matrix
//    let a:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    let b:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    let d:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    matrixService.addSelectedMatrix(a);
//    matrixService.addSelectedMatrix(b);
//    matrixService.addSelectedMatrix(d);
//    let c:Array<number> = <Array<number>>instanceFunctionToolbar.clickAddFunctionAdd();
//    {
//    // expect 4 edges, 3 matrices, 2 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(4);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(3);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(2);
//    }
//    { 
//    // expect zero edges, two matrices, zero functions
//    matrixService.addSelectedMatrix(b);
//    instanceTopToolbar.erase();
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(0);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(2);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(0);
//    }    
//    }
//    
//    
//    instanceTopToolbar.selectAll();
//    instanceTopToolbar.erase();
//    
//    {
//    // add 3 matrices 2 functions, remove matrix
//    let a:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    let b:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    let d:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    let e:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    let f:number = <number>instanceMatrixToolbar.clickAddMatrix();
//    matrixService.addSelectedMatrix(a);
//    matrixService.addSelectedMatrix(b);
//    matrixService.addSelectedMatrix(d);
//    matrixService.addSelectedMatrix(e);
//    matrixService.addSelectedMatrix(f);
//    let c:Array<number> = <Array<number>>instanceFunctionToolbar.clickAddFunctionAdd();
//    {
//    // expect 8 edges, 5 matrices, 4 functions
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(8);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(5);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(4);
//    }
//    { 
//    // expect 4 edges, 4 matrices, 2 functions
//    matrixService.addSelectedMatrix(d);
//    instanceTopToolbar.erase();
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(4);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(4);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(2);
//    }
//      
//    { 
//    // expect 6 edges, 4 matrices, 3 functions
//    matrixService.addSelectedMatrix(b);
//    matrixService.addSelectedMatrix(e);
//    c.concat(<Array<number>>instanceFunctionToolbar.clickAddFunctionAdd());
//    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
//    expect(edgesBag.size()).toEqual(6);
//    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
//    expect(matrices.length).toEqual(4);
//    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
//    expect(functions.length).toEqual(3);
//    }
//      
//    }
//    
    

  
});

//  it('edge swap', () => {
//    
//    // check that the edge in LL in function agrees with the edge in LL in mat-func-container
//    // whenever swapping
//    
//  });
//
//           
//         
//         mq    mr
// 
//           \  /
//            QR
//
//             |
//
//             r 
//
//             |
//
//           add
//          /  |  \
//        m1   m2   m3
//
//
