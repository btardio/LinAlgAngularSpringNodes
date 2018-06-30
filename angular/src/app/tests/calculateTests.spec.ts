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
import { SpringPost } from '../matrix-http-client.service';

describe('Basic Tests > ', () => {

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
    HttpClientModule,
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
  
  
  
  it('should add two matrices', () => {
    
    instanceMatrixToolbar.setMatrix([[1,2,6], [0,3,1]]);
    instanceMatrixToolbar.clickAddMatrix();
    
    instanceMatrixToolbar.setMatrix([[1,55,31], [11,8,6]]);
    instanceMatrixToolbar.clickAddMatrix();
    
    instanceTopToolbar.selectAll();
    
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    
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
    
    const makePostInterfaceSpy: jasmine.Spy = spyOn( matrixHttpClientService, 'makePostInterface' ).and.callThrough();
    
    instanceTopToolbar.clickCalc();
    
    let springPost: SpringPost = matrixHttpClientService.makePostInterface( makePostInterfaceSpy.calls.argsFor(0)[0], 
                                                                              makePostInterfaceSpy.calls.argsFor(0)[1] ); 
    
    console.log(springPost);
    
    let expected: Array<Array<Array<number>>> = new Array<Array<Array<number>>>(); 
    
    expected.push([[1,55,31], [11,8,6]]);
    expected.push([[1,2,6], [0,3,1]]);
    
    expect(springPost.matrices).toEqual(expected);
    expect(springPost.operations).toEqual(['+']);
    expect(springPost['@type']).toEqual('SimpleJson');
  
    makePostInterfaceSpy.calls.reset();
    
  });

  
  it('should add three matrices', () => {
    
    instanceMatrixToolbar.setMatrix([[1,2,6], [0,3,1]]);
    instanceMatrixToolbar.clickAddMatrix();
    
    instanceMatrixToolbar.setMatrix([[1,55,31], [11,8,6]]);
    instanceMatrixToolbar.clickAddMatrix();
    
    instanceMatrixToolbar.setMatrix([[71,50,61], [42,44,98]]);
    instanceMatrixToolbar.clickAddMatrix();
    
    instanceTopToolbar.selectAll();
    
    let addedFromAddFunction: Array<LinAlgMatrix | LinAlgFunction> = instanceFunctionToolbar.clickAddFunctionAdd();
    
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
    
    const makePostInterfaceSpy: jasmine.Spy = spyOn( matrixHttpClientService, 'makePostInterface' ).and.callThrough();
    
    instanceTopToolbar.clickCalc();
    
    let springPost: SpringPost = matrixHttpClientService.makePostInterface( makePostInterfaceSpy.calls.argsFor(0)[0], 
                                                                              makePostInterfaceSpy.calls.argsFor(0)[1] ); 
    
    console.log(springPost);
    
    let expected: Array<Array<Array<number>>> = new Array<Array<Array<number>>>(); 
    
    expected.push([[71,50,61], [42,44,98]]);
    expected.push([[1,55,31], [11,8,6]]);
    expected.push([[1,2,6], [0,3,1]]);
    
    
    expect(springPost.matrices).toEqual(expected);
    expect(springPost.operations).toEqual(['+','+']);
    expect(springPost['@type']).toEqual('SimpleJson');
  
    makePostInterfaceSpy.calls.reset();
    
  });

  
});
    // test 
    // test renderSignal.subscribe
    // test nodes: Array<SvgNode>;
    //svgRenderService.
  
  







