import { LinAlgMatrix } from './matrix';
import { Operenum } from './operenum.enum';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { LinkedList as basLinkedList } from 'typescript-collections';
import { LinAlgFunction } from './matrix-function';
import { MatrixService } from './matrix-service.service';

export interface DoubleMatrix {

  rows: number;
  columns: number;
  length: number;
  data: Array<number>;
  scalar: boolean;
  square: boolean;
  vector: boolean;
  rowVector: boolean;
  columnVector: boolean;
  lowerTriangular: boolean;
  upperTriangular: boolean;
  empty: boolean;

}


export interface SpringPost {

  '@type': string;
  matrices: Array<Array<Array<number>>>;
  operations: Array<string>;

}

export interface SpringPostResponse {

  '@type': string;
  matrices: Array<Array<Array<number>>>;
  operations: Array<string>;
  dmatrices: Array<DoubleMatrix>;
  rdmatrix: DoubleMatrix;
  rmatrix: Array<Array<number>>;

}


@Injectable({
  providedIn: 'root'
})
export class MatrixHttpClientService {

  private urlStr = 'http://127.0.0.1:8080/matrices';

  private sbjPostReturned: Subject<null> = new Subject<null>();
  postReturned$: Observable<LinAlgFunction> = this.sbjPostReturned.asObservable();

  /**
   * Subscriptions listening for input,
   */
  inputListeners: Array<Subscription>;

  constructor( private http: HttpClient ) {

    this.inputListeners = new Array<Subscription>();

  }


//  makePostInterfaceTester ( postInterface: SpringPost ): SpringPost {
//    return postInterface;
//  }

  makePostInterface( matrices: basLinkedList<LinAlgMatrix>, f: LinAlgFunction ): SpringPost {

    const postInterface: SpringPost = {'@type': 'SimpleJson', matrices: null, operations: null};

    postInterface.matrices = new Array<Array<Array<number>>>();
    postInterface.operations = new Array<string>();

    let first = true;

    matrices.forEach( m => {

      postInterface.matrices.push( m.getMatrix() );

      if ( first ) {
        first = false;
      }
      else {
        if ( f.getOperand() === Operenum.Add ) { postInterface.operations.push('+'); }
        else if ( f.getOperand() === Operenum.Subtract ) { postInterface.operations.push('-'); }
        else if ( f.getOperand() === Operenum.Multiply ) { postInterface.operations.push('*'); }
      }

    });

    return postInterface;

  }

  makeRequest( f: LinAlgFunction ): Observable<SpringPostResponse> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const matrices: basLinkedList<LinAlgMatrix> = f.getInputMatrices();
    let postInterface: SpringPost = this.makePostInterface( matrices, f );

  //  "http://127.0.0.1:8080/matrices"

    // postInterface.matrices =
    return this.http.post<SpringPostResponse>(this.urlStr, postInterface, httpOptions);

    // '{"@type":"SimpleJson","matrices":[[[1,2],[3,4]],[[5,6],[7,8]]],"operations":["+"]}',
    // httpOptions);
    // return http.get( 'http://127.0.0.1:8080' + '/matrices'); // .subscribe(data => { console.log(data); });
  }

  calc( f: LinAlgFunction ): void {



    this.makeRequest( f ).subscribe( response => {

        if ( f.getOutputMatrices().size() !== 1 ) {
          throw Error('Unable to calculate two output matrices for operand.');
        }

        const outputMatrix: LinAlgMatrix = f.getOutputMatrices().first();

        outputMatrix.setMatrix( response.rmatrix );

        this.sbjPostReturned.next();

        // signal that the function has completed makeRequest
        // f.current = true;
        // f.signalCalcComplete();
    } );

    f.getInputMatrices().forEach( m => {
      console.log('matrix to calc:' + m.getMatrix());
    });

  }


//  setToCalcInFuture(f: LinAlgFunction): void {
//    console.log('set to calc in future');
//    // this.inputListeners.push( f.inputsComplete$.subscribe( somenullvar => { this.calc(f); } ) );
//
//  }

}

