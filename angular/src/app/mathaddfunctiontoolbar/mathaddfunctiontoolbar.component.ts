import { HideShowService } from '../hideshowservices.service';
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

  clickadd(): number | Array<number> {

    let addedid: number | Array<number>;

    const matrixfunction: LinAlgFunction = new LinAlgFunction(Operenum.Add);

    addedid = this.matrixService.addFunction(matrixfunction);

    this.hideshowservice.swapHiddenmathaddfunctiontoolbar( );

    return addedid;
  }

}
