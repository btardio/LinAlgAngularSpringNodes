import { MathaddfunctiontoolbarComponent } from '../mathaddfunctiontoolbar/mathaddfunctiontoolbar.component';
import { MathaddmatrixtoolbarComponent } from '../mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';
import { LinAlgMatrix } from '../matrix';
import { LinAlgFunction } from '../matrix-function';
import { MatrixService } from '../matrix-service.service';
export class TestHelperClass {

  static addMatrices( n: number, instanceMatrixToolbar: MathaddmatrixtoolbarComponent ): Array<LinAlgMatrix> {

    const rval: Array<LinAlgMatrix> = new Array<LinAlgMatrix>();

    for ( let i = 0; i < n; i++ ) {
      rval.push(instanceMatrixToolbar.clickAddMatrix());
    }

    return rval;
  }

  static addFunctions( n: number, instanceFunctionToolbar: MathaddfunctiontoolbarComponent ): Array<LinAlgFunction|LinAlgMatrix> {

    let rval: Array<LinAlgFunction|LinAlgMatrix> = new Array<LinAlgFunction|LinAlgMatrix>();

    for ( let i = 0; i < n; i++ ) {
      rval = rval.concat(instanceFunctionToolbar.clickAddFunctionAdd());
    }

    return rval;
  }

  static selectRandomMatrices( n: number, matrices: Array<LinAlgMatrix>, matrixService: MatrixService ): Array<LinAlgMatrix> {

    let n_added = 0;
    const rval: Array<LinAlgMatrix> = new Array<LinAlgMatrix>();

    while ( n_added < n ) {

      const randomnum = Math.floor(Math.random() * matrices.length);

      if ( rval.indexOf( matrices[randomnum] ) === -1 ) {
        rval.push( matrices[randomnum] );
        n_added += 1;
        matrixService.addSelectedMatrix( matrices[randomnum].getId() );
      }

    }

    return rval;

  }

  static selectRandomFunctions( n: number, functions: Array<LinAlgFunction>, matrixService: MatrixService ): Array<LinAlgFunction> {

    let n_added = 0;
    const rval: Array<LinAlgFunction> = new Array<LinAlgFunction>();

    while ( n_added < n ) {

      const randomnum = Math.floor(Math.random() * functions.length);

      if ( rval.indexOf(functions[randomnum]) == -1 ) {
        rval.push( functions[randomnum] );
        n_added += 1;
        matrixService.addSelectedFunction( functions[randomnum].getId() );
      }

    }

    return rval;

  }
}



