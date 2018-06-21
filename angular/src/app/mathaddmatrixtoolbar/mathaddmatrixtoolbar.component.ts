
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

  boolhiddenaddmatrix = true;  // wired to template

  matrix: Array<Array<string>>;

  // matrixService from constructor

  constructor(private matrixService: MatrixService, private hideshowservice: HideShowService ) {

    this.matrix = [['1', '3'], ['0', '1']];

    hideshowservice.hiddenmathaddmatrixtoolbarObs$.subscribe( boolhidden => { this.boolhiddenaddmatrix = boolhidden; } );

  }

  ngOnInit() {

  }

  saverange(i, j) {


  }

  addRow() {
    const joinarray: string[] = [];
    for ( let i = 0; i < this.matrix[0].length; i++ ) {
      joinarray[i] = '0';
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
    for ( let i = 0; i < this.matrix.length; i++) {

      this.matrix[i].push('0');

    }
  }

  deleteColumn() {
    if ( this.matrix[0].length > 1) {
      for ( let i = 0; i < this.matrix.length; i++) {

        this.matrix[i].pop();

      }
    }
  }

  finished(): number {

    let addedid: number;

    const mnew: Array<Array<number>> = new Array<Array<number>>();

    for ( let i = 0; i < this.matrix.length; i++ ) {

      mnew[i] = new Array<number>();

      for ( let j = 0; j < this.matrix[i].length; j++ ) {

        mnew[i][j] = parseFloat(this.matrix[i][j]); // , 10);

      }

    }

    const m = new LinAlgMatrix(mnew);

    addedid = this.matrixService.addMatrix(m);

    this.hideshowservice.swapHiddenmathaddmatrixtoolbar();

    return addedid;
  }


}