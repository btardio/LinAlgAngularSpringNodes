import { TestBed, inject } from '@angular/core/testing';

import { async, ComponentFixture } from '@angular/core/testing';

import { MathaddfunctiontoolbarComponent } from './mathaddfunctiontoolbar/mathaddfunctiontoolbar.component';

import * as dagre from 'dagre';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

import { MathtoptoolbarComponent } from './mathtoptoolbar/mathtoptoolbar.component';
import { HideShowService } from './hideshowservices.service';
import { MatrixService } from './matrix-service.service';
import { NgZone, DebugElement }    from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgRenderServiceService } from './svg-render-service.service';
import { MathaddmatrixtoolbarComponent } from './mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { Operenum } from './operenum.enum';
import { SvgMessage } from './svg-message';
import { Bag as basBag } from 'typescript-collections';
import { LinAlgEdge } from './edge';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatrixHttpClientService } from './matrix-http-client.service';

describe('MatrixServiceService', () => {

  let fixtureFunctionToolbar: ComponentFixture<MathaddfunctiontoolbarComponent>;
  let fixtureMatrixToolbar: ComponentFixture<MathaddmatrixtoolbarComponent>;
  let fixtureTopToolbar: ComponentFixture<MathtoptoolbarComponent>;
  
  let instanceTopToolbar: MathtoptoolbarComponent;
  let instanceFunctionToolbar: MathaddfunctiontoolbarComponent;
  let instanceMatrixToolbar: MathaddmatrixtoolbarComponent;
    
  let httpMock: HttpTestingController;
    
  let matrixHttpClientService: MatrixHttpClientService;
  
  let ngZone: NgZone;
    
  let svgRenderService: SvgRenderServiceService;
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
                   SvgRenderServiceService,
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
    svgRenderService = TestBed.get(SvgRenderServiceService);
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
  
  
  xit('add delete nodes', () => {
    // console.log ( element('.value-entry input').is(':visible')).toBe(true) );
    // console.log ( element.query( By.css('#boolhiddenaddfunctionid') ) );
    
    
    
    // <number>instanceFunctionToolbar.clickadd();
    // <number>instanceMatrixToolbar.finished();
    // matrixService.addSelectedMatrix(removeid);
    instanceMatrixToolbar.matrix = [['1','2','0'], ['0','3','1']];
    
    // add two matrices 1 function, remove and readadd function
    let a:number = <number>instanceMatrixToolbar.finished();
    let b:number = <number>instanceMatrixToolbar.finished();
    matrixService.addSelectedMatrix(a);
    matrixService.addSelectedMatrix(b);
    let c:Array<number> = <Array<number>>instanceFunctionToolbar.clickadd();
    {
    // expect two edges, two matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(2);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(2);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    }
    { 
    // expect zero edges, two matrices, zero functions
    matrixService.addSelectedFunction(c[0]);
    instanceTopToolbar.erase();
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(2);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(0);
    }
    
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();
     
    {
    // add two matrices 1 function, remove matrix
    let a:number = <number>instanceMatrixToolbar.finished();
    matrixService.addSelectedMatrix(a);
    let c:number = <number>instanceFunctionToolbar.clickadd();
    {
    // expect one edges, one matrices, one function
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(1);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(1);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(1);
    expect(matrixService.getSelectedMatricesAsLinkedList().size()).toEqual(0);
    expect(matrixService.getSelectedFunctionsAsLinkedList().size()).toEqual(0);
    }
    { 
    // expect zero edges, one matrices, zero functions
    matrixService.addSelectedFunction(c);
    instanceTopToolbar.erase();
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(1);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(0);
    }
    }
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();
    
    {
    // add 3 matrices 2 functions, remove matrix
    let a:number = <number>instanceMatrixToolbar.finished();
    let b:number = <number>instanceMatrixToolbar.finished();
    let d:number = <number>instanceMatrixToolbar.finished();
    matrixService.addSelectedMatrix(a);
    matrixService.addSelectedMatrix(b);
    matrixService.addSelectedMatrix(d);
    let c:Array<number> = <Array<number>>instanceFunctionToolbar.clickadd();
    {
    // expect 4 edges, 3 matrices, 2 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(4);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(3);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(2);
    }
    { 
    // expect zero edges, two matrices, zero functions
    matrixService.addSelectedMatrix(b);
    instanceTopToolbar.erase();
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(0);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(2);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(0);
    }    
    }
    
    
    instanceTopToolbar.selectAll();
    instanceTopToolbar.erase();
    
    {
    // add 3 matrices 2 functions, remove matrix
    let a:number = <number>instanceMatrixToolbar.finished();
    let b:number = <number>instanceMatrixToolbar.finished();
    let d:number = <number>instanceMatrixToolbar.finished();
    let e:number = <number>instanceMatrixToolbar.finished();
    let f:number = <number>instanceMatrixToolbar.finished();
    matrixService.addSelectedMatrix(a);
    matrixService.addSelectedMatrix(b);
    matrixService.addSelectedMatrix(d);
    matrixService.addSelectedMatrix(e);
    matrixService.addSelectedMatrix(f);
    let c:Array<number> = <Array<number>>instanceFunctionToolbar.clickadd();
    {
    // expect 8 edges, 5 matrices, 4 functions
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(8);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(5);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(4);
    }
    { 
    // expect 4 edges, 4 matrices, 2 functions
    matrixService.addSelectedMatrix(d);
    instanceTopToolbar.erase();
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(4);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(4);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(2);
    }
      
    { 
    // expect 6 edges, 4 matrices, 3 functions
    matrixService.addSelectedMatrix(b);
    matrixService.addSelectedMatrix(e);
    c.concat(<Array<number>>instanceFunctionToolbar.clickadd());
    let edgesBag: basBag<LinAlgEdge> = matrixService.getEdges();
    expect(edgesBag.size()).toEqual(6);
    let matrices: Array<LinAlgMatrix> = matrixService.getMatrices();
    expect(matrices.length).toEqual(4);
    let functions: Array<LinAlgFunction> = matrixService.getFunctions();
    expect(functions.length).toEqual(3);
    }
      
    }
    
    
    
  });
  
});


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
