
import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MathaddmatrixtoolbarComponent } from '../mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';
import { MathaddfunctiontoolbarComponent } from '../mathaddfunctiontoolbar/mathaddfunctiontoolbar.component';
import { HideShowService } from '../hideshowservices.service';
import { MatFuncContainer } from '../matrix-func-container';
import { MatrixService } from '../matrix-service.service';
import { SvgRenderService } from '../svg-render-service.service';
import { Subscription } from 'rxjs';

// import { Mathaddmatrixtoolbar } from './mathaddmatrixtoolbar/
// .../mathaddmatrixtoolbar/mathaddmatrixtoolbar.Component';

@Component({
  selector: 'app-mathtoptoolbar',
  templateUrl: './mathtoptoolbar.component.html',
  styleUrls: ['./mathtoptoolbar.component.css',
              './materialize.min.css'],
  encapsulation: ViewEncapsulation.Emulated, // can be also .Native
  // imports: [MathaddmatrixtoolbarComponent, MathaddfunctiontoolbarComponent ]

})
export class MathtoptoolbarComponent implements OnInit {

  addmatrixdisabled = false;
  addfunctiondisabled = true;
  erasedisabled = true;
  calcdisabled = false;
  swaporderdisabled = false;
  matrixHideShowServiceSubscription: Subscription;
  functionHideShowServiceSubscription: Subscription;
//  matrixServiceSubscription: Subscription;

  constructor( private hideshowservice: HideShowService,
               private matrixService: MatrixService,
               private svgRenderService: SvgRenderService ) {

//        this.matrixServiceSubscription = this.matrixService.selectedMatricesChanged$.subscribe(
//          matrixServiceClone => {
//
//          this.setButtonVisibility ( );
//
//        });
//
//        this.matrixServiceSubscription = this.matrixService.selectedFunctionsChanged$.subscribe(
//          matrixServiceClone => {
//
//          this.setButtonVisibility ( );
//
//        });

        /**
         * If the contents of the container changed, there will be nothing selected,
         * set button visibility accordingly.
         */
//        this.matrixService.containerChanged$.subscribe( nullvar => {
//
//          this.setButtonVisibility();
//
//        });

        /**
         * If the selected nodes change, reset button visibility.
         */
        this.matrixService.selectedChanged$.subscribe( nullvar => {

          this.setButtonVisibility();

        });

  }

  ngOnInit() {

  }

  clickCalc() {
    this.matrixService.clickCalc();
  }

  clickContainerChanged() {
    this.matrixService.containerChanged();
  }

  setButtonVisibility( ) {

    const selectedMatricesArray: Array<number> = this.matrixService.getSelectedMatricesAsArray();
    const selectedFunctionsArray: Array<number> = this.matrixService.getSelectedFunctionsAsArray();
    const matFuncContainer: MatFuncContainer = this.matrixService.getMatFuncContainer();

    if ( 1 + 1 === 2 ) { this.erasedisabled = false; this.addmatrixdisabled = false; this.addfunctiondisabled = false; return; }

    if ( selectedMatricesArray.length === 1 && selectedFunctionsArray.length === 0 ) {
      this.erasedisabled = false;
      this.addmatrixdisabled = true;
      this.addfunctiondisabled = false;
    }
    else if ( selectedMatricesArray.length === 0 && selectedFunctionsArray.length === 1 ) {
      this.erasedisabled = false;
      this.addmatrixdisabled = false;
      this.addfunctiondisabled = true;
    }
    else if ( selectedMatricesArray.length > 0 || selectedFunctionsArray.length > 0 ) {
      this.erasedisabled = false;
      this.addmatrixdisabled = true;
      this.addfunctiondisabled = true;
    }
    else if ( matFuncContainer.getMatricesLength() === 0 ) {
      this.erasedisabled = true;
      this.addmatrixdisabled = false;
      this.addfunctiondisabled = true;
    }
    else {
      this.erasedisabled = true;
      this.addmatrixdisabled = true;
      this.addfunctiondisabled = true;
    }
  }

  addMatrix() { // wired to template

    this.hideshowservice.swapHiddenmathaddmatrixtoolbar();

  }

  addFunction() { // wired to template

    this.hideshowservice.swapHiddenmathaddfunctiontoolbar();
  }

  addEdge() {
    try {
      this.matrixService.clickAddEdge();
    }
    catch (e) {
      throw Error(e);
    }
    finally {
      this.matrixService.clearSelectedAll();
      this.matrixService.containerChanged();
    }
  }

  swapDirection() {

    this.matrixService.clickSwapDirection();
    this.matrixService.clearSelectedAll();
    this.matrixService.containerChanged();

  }

  swapOrder() {

    this.matrixService.clickSwapOrder();
    this.matrixService.clearSelectedAll();
    this.matrixService.containerChanged();

  }

  erase() { // wired to template
    this.matrixService.deleteSelectedMatrices();
    this.matrixService.deleteSelectedFunctions();
    this.matrixService.clearSelectedAll();
    this.matrixService.containerChanged();

  }

  selectAll() { // wired to template

    this.matrixService.selectAll();
    this.matrixService.containerChanged();
    // this.svgRenderService.render();
  }

}
