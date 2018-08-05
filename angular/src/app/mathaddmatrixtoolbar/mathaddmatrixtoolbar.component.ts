
import { NgModule, Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // , FormControl, Validators
import { MatrixService } from '../matrix-service.service';
import { HideShowService } from '../hideshowservices.service';
import { LinAlgMatrix } from '../matrix';

@Component({
  selector: 'app-mathaddmatrixtoolbar',
  templateUrl: './mathaddmatrixtoolbar.component.html',
  styleUrls: ['./mathaddmatrixtoolbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated, // can be also .Native

})
export class MathaddmatrixtoolbarComponent implements OnInit {

  private boolhiddenaddmatrix = true;  // wired to template

  private matrix: Array<Array<number>>;

  private ainput: Array<number>;

  // matrixService from constructor

  constructor(private matrixService: MatrixService, private hideshowservice: HideShowService ) {

    this.matrix = new Array<Array<number>>();

    const rowa = new Array<number>();
    rowa.push(1);
    rowa.push(2);
    rowa.push(3);

    const rowb = new Array<number>();
    rowb.push(4);
    rowb.push(5);
    rowb.push(6);

    const rowc = new Array<number>();
    rowc.push(7);
    rowc.push(8);
    rowc.push(9);

    this.matrix.push(rowa);
    this.matrix.push(rowb);
    this.matrix.push(rowc);

    // this.ainput = [1, 2, 3, 4, 5, 6, 7, 8];

    hideshowservice.hiddenmathaddmatrixtoolbarObs$.subscribe( boolhidden => { this.boolhiddenaddmatrix = boolhidden; } );

  }

  ngOnInit() {

  }

  getMatrix(): Array<Array<number>> {
    return this.matrix;
  }

  setMatrix( matrix: Array<Array<number>> ) {
    this.matrix = matrix;
  }

  addRow() {
    const joinarray: number[] = [];
    for ( let i = 0; i < this.matrix[0].length; i++ ) {
      joinarray[i] = 0;
    }

    this.matrix[this.matrix.length] = joinarray;

  }

  deleteRow() {
    // make sure matrix is at least 1 x 1
    if ( this.matrix.length > 1 ) {

      this.matrix.pop();

    }
  }

  addColumn() {

    const newMatrix: Array<Array<number>> = new Array<Array<number>>();

    for ( let i = 0; i < this.matrix.length; i++) {

      const newRow: Array<number> = new Array<number>();

      for ( let j = 0; j < this.matrix[i].length; j++ ) { 
        newRow.push(this.matrix[i][j]); 
      }
      newRow.push(0);
      
      newMatrix.push(newRow);

    }
    
    this.matrix = newMatrix;
  }

  deleteColumn() {
    if ( this.matrix[0].length > 1) {
      for ( let i = 0; i < this.matrix.length; i++) {

        this.matrix[i].pop();

      }
    }
  }

  clickAddMatrix(): LinAlgMatrix {

    let rval: LinAlgMatrix;

    const mnew: Array<Array<number>> = new Array<Array<number>>();

    for ( let i = 0; i < this.matrix.length; i++ ) {

      mnew[i] = new Array<number>();

      for ( let j = 0; j < this.matrix[i].length; j++ ) {

        mnew[i][j] = this.matrix[i][j]; // parseFloat(this.matrix[i][j]); // , 10);

      }

    }

    const m = new LinAlgMatrix(mnew);

    rval = this.matrixService.addMatrix(m);

    this.hideshowservice.swapHiddenmathaddmatrixtoolbar();

    this.matrixService.clearSelectedAll();

    this.matrixService.containerChanged();

    return rval;
  }


}
