import { HideShowService } from '../hideshowservices.service';
import { LinAlgMatrix } from '../matrix';
import { LinAlgFunction } from '../matrix-function';
import { MatrixService } from '../matrix-service.service';
import { Operenum } from '../operenum.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mathaddfunctiontoolbar',
  templateUrl: './mathaddfunctiontoolbar.component.html',
  styleUrls: ['./mathaddfunctiontoolbar.component.css']
})
export class MathaddfunctiontoolbarComponent implements OnInit {

  boolhiddenaddfunction = true; // wired to template

  constructor(private matrixService: MatrixService, private hideshowservice: HideShowService) {

  hideshowservice.hiddenmathaddfunctiontoolbarObs$.subscribe( boolhidden => { this.boolhiddenaddfunction = boolhidden; } );

  }

  ngOnInit() {
  }

  clickAddFunctionAdd(): Array<LinAlgMatrix | LinAlgFunction> {

    let rval: Array<LinAlgMatrix|LinAlgFunction>;

    const matrixfunction: LinAlgFunction = new LinAlgFunction(Operenum.Add);

    rval = this.matrixService.addFunction(matrixfunction);

    this.hideshowservice.swapHiddenmathaddfunctiontoolbar( );

    this.matrixService.clearSelectedAll();

    this.matrixService.containerChanged();

    return rval;
  }

  clickAddFunctionSubtract(): Array<LinAlgMatrix | LinAlgFunction> {

    let rval: Array<LinAlgMatrix|LinAlgFunction>;

    const matrixfunction: LinAlgFunction = new LinAlgFunction(Operenum.Subtract);

    rval = this.matrixService.addFunction(matrixfunction);

    this.hideshowservice.swapHiddenmathaddfunctiontoolbar( );

    this.matrixService.clearSelectedAll();

    this.matrixService.containerChanged();

    return rval;
  }


  clickAddFunctionProduct(): Array<LinAlgMatrix | LinAlgFunction> {

    let rval: Array<LinAlgMatrix|LinAlgFunction>;

    const matrixfunction: LinAlgFunction = new LinAlgFunction(Operenum.Multiply);

    rval = this.matrixService.addFunction(matrixfunction);

    this.hideshowservice.swapHiddenmathaddfunctiontoolbar( );

    this.matrixService.clearSelectedAll();

    this.matrixService.containerChanged();

    return rval;
  }


}
