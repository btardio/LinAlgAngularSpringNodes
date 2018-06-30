import { Dimensions } from './dimensions';
import { LinAlgEdge } from './edge';
import { LinAlgMatrix } from './matrix';
import { MatrixHttpClientService } from './matrix-http-client.service';
import { MatrixService } from './matrix-service.service';
import { Operenum } from './operenum.enum';
import { HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription, Observer } from 'rxjs';
import { LinkedList as basLinkedList } from 'typescript-collections';
import { Bag as basBag } from 'typescript-collections';


export class LinAlgFunction {
  /**
   * An ID unique between LinAlgFunction, LinAlgMatrix and LinAlgEdge
   */
  private id: number;

  /**
   * The enumerated operation, +, -, *, QR, etc.
   */
  private operand: Operenum;

  /**
   * Describes whether this function is selected or not.
   */
  private selected: boolean;

  /**
   * The edges, order matters for multiplication, subtraction, of the edges of the function.
   */
  private edges: basLinkedList<LinAlgEdge>;


  /**
   * Instantiates the class, setting operand and, if provided, the edges
   */
  constructor( operand: Operenum,
               edges?: basLinkedList<LinAlgEdge> ) {

    this.operand = operand;
    this.selected = false;
    this.edges = new basLinkedList<LinAlgEdge>();

    if ( edges !== null && edges !== undefined ) {
      edges.forEach( edge => {
        this.edges.add(edge);
      });
    }
  }

  /**
   * Swaps the order of two edges.
   */
  swapEdges( a: LinAlgEdge, b: LinAlgEdge ) {

    if ( !this.edges.contains(a) || ! this.edges.contains(b) ) {
      throw Error('Function does not have edge requested to be swapped.');
    }

    const indexa: number = this.edges.indexOf(a);
    const indexb: number = this.edges.indexOf(b);

    const asArray: Array<LinAlgEdge> = this.edges.toArray();

    asArray[indexa] = b;
    asArray[indexb] = a;

    this.edges.clear();

    asArray.forEach( e => { this.edges.add(e); } );

  }

  /**
   * Calculates the inputs of this function, calling the HttpClientService
   * This function is not to be called directly, should be called from MatrixService
   */
  calc( matrixHttpClient: MatrixHttpClientService ): Observable<LinAlgFunction> {

    const boolns: Array<boolean> = new Array<boolean>();

    return Observable.create(observer => {
      this.getInputMatrices().forEach( m => {

        m.calc( matrixHttpClient ).subscribe( m => {

          boolns.push( true );

          if ( boolns.length == this.getInputMatrices().size() ) {

            matrixHttpClient.makeRequest( this ).subscribe( response => {

//              if ( this.getOutputMatrices().size() !== 1 ) {
//                throw Error('Unable to calculate two output matrices for operand.');
//              }

              this.getOutputMatrices().forEach( m => {
                m.setMatrix( response.rmatrix );
              });
              //const outputMatrix: LinAlgMatrix = this.getOutputMatrices().first();

              //outputMatrix.setMatrix( response.rmatrix );

              observer.next(this);
              observer.complete();
            });
          } else if ( boolns.length > this.getInputMatrices().size() ) { throw Error('More observables returned than expected.'); }
        } );
      } );

    });

  }


  /**
   * Returns true if this matrix has no input from another function, also means this matrix is an end matrix
   */
  isBottomEndFunction(): boolean {

    const matrices: basLinkedList<LinAlgMatrix> = this.getInputMatrices();

    if ( matrices.size() === 0 ) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if this matrix has no output to another function, also means this matrix is an end matrix
   */
  isTopEndFunction(): boolean {

    const matrices: basLinkedList<LinAlgMatrix> = this.getOutputMatrices();

    if ( matrices.size() === 0 ) {
      return true;
    }

    return false;

  }



  /**
   * Sets the unique id of the function.
   */
  setId( id: number ): void {
    this.id = id;
  }

  /**
   * Returns the operand of the function.
   */
  getOperand(): Operenum {
    return this.operand;
  }

  /**
   * Returns the edges as a linked list.
   */
  getEdges(): basLinkedList<LinAlgEdge> {
    return this.edges;
  }

  /**
   * Returns the matrices that are outputs of this function. This is
   * determined by the direction of the edges.
   */
  getOutputMatrices(): basLinkedList<LinAlgMatrix> {
    const moutputs: basLinkedList<LinAlgMatrix> = new basLinkedList<LinAlgMatrix>();

    this.edges.forEach( e => {

      if ( e.isPointedAtMatrix() ) {
        moutputs.add(e.getMatrixOfIJ());
      }

    } );

    return moutputs;
  }

  /**
   * Returns the matrices that are inputs of this function. This is determined by the
   * direction of the edges.
   */
  getInputMatrices(): basLinkedList<LinAlgMatrix> {

    const minputs: basLinkedList<LinAlgMatrix> = new basLinkedList<LinAlgMatrix>();

    this.edges.forEach( e => {

      if ( e.isPointedAtFunction() ) {
        minputs.add(e.getMatrixOfIJ());
      }

    });

    return minputs;
  }

  /**
   * Removes an edge connected from this function to a matrix. Removes the
   * edge locally, in the this.edges linked list.
   */
  removeEdgeConnectedToMatrix( m: LinAlgMatrix ) {

    let found = false;
    let e: LinAlgEdge = null;

    this.edges.forEach( edge => {

      if ( edge.getMatrixOfIJ() === m ) {

        if ( found ) { throw Error('Function has multiple edges connected to single matrix.'); }

        found = true;

        e = edge;

      }

    });

    if ( !found ) {
      throw Error('Trying to remove an edge from a Function that does not exist.');
    }

    this.edges.remove(e);

  }

  /**
   * calculates the dimensions of the output matrix, returning a Dimension instance
   * also determines if the dimensions are suitable for the operand. In the case
   * of a decomposition, QR SVD, etc, returns a list of the dimensions.
   *
   */
  private getDimensionsForOperand(): Dimensions | Array<Dimensions> {

    let n_rows = 0;
    let n_columns = 0;

    if ( this.operand === Operenum.Add ) {

      let first = true;
      let check = false;

      this.edges.forEach( edge => {

        if ( check ) {
          if ( edge.getMatrixOfIJ().getMatrixAsArray().length !== n_rows ) {
            throw Error('Dimensions error for addition.');
          }
        }
        n_rows = edge.getMatrixOfIJ().getMatrixAsArray().length;

        if ( n_rows === 0 ) {
          throw Error('Matrix has 0 rows');
        }

        if ( check ) {
          if ( edge.getMatrixOfIJ().getMatrixAsArray()[0].length !== n_columns ) {
            throw Error('Dimensions error for addition');
          }
        }
        n_columns = edge.getMatrixOfIJ().getMatrixAsArray()[0].length;

        if ( n_columns === 0 ) {
          throw Error('Matrix has 0 columns');
        }

      });

      if ( first ) { first = false; check = true; }

    }
    return new Dimensions(n_rows, n_columns);
  }

  /**
   * Returns a matrix that is an accurate dimension output array for the inputs of the function,
   * In the case of a decomposition, returns an array of accurate dimension arrays
   * The arrays contain all zeros.
   */
  getZeroAccurateDimensionArray (): Array<Array<number>> | Array<Array<Array<number>>> {

    const dims: Dimensions | Array<Dimensions> = this.getDimensionsForOperand();

    if ( dims instanceof Dimensions ) {

      const rarray: Array<Array<number>> = new Array<Array<number>>();

      for ( let i = 0; i < dims.getRowsDimensions(); i++ ) {
        rarray.push( new Array<number>() );
        for ( let j = 0; j < dims.getColumnsDimensions(); j++ ) {
          rarray[i].push(0);
        }
      }

      return rarray;
    }
    else if ( dims instanceof Array ) {

      const rarray: Array<Array<Array<number>>> = new Array<Array<Array<number>>>();

      // TODO decomposition

      return rarray;

    }

  }

  /**
   * Returns true if the edge is part of this function.
   */
  hasEdge( edge: LinAlgEdge ): boolean {

    return this.edges.contains( edge );

  }

  /**
   * Adds an edge to the function.
   */
  addEdge(edge: LinAlgEdge): void {

    if ( this.edges.contains(edge) ) {
      throw Error('Trying to add an edge to function that already exists.');
    }

    this.edges.add(edge);

  }

  /**
   * Removes an edge from the function
   */
  removeEdge(edge: LinAlgEdge): void {

    if ( !this.edges.contains(edge) ) {
      throw Error('Trying to remove an edge of a function that does not exist.');
    }

    this.edges.remove( edge );

  }

  /**
   * Return whether this function is selected or not.
   */
  getSelected(): boolean {
    return this.selected;
  }

  /**
   * Sets whether this function is selected or not.
   */
  setSelected(selected: boolean): void {
    this.selected = selected;
  }

  /**
   * Returns a clone of this function
   */
  getClone(): LinAlgFunction {
    return new LinAlgFunction( this.operand );
  }

  /**
   * Returns the unique Id
   */
  getId(): number {
    return this.id;
  }

  /**
   * Returns the string representation of the function. This representation
   * is in use by typescript-collections for comparison.
   */
  toString(): string {

    const rStr: string = '{id:' + this.id + ',operand:';

    switch (this.operand) {
      case 0:
        return rStr + 'Add}';
      case 1:
        return rStr + 'Subtract}';
      case 2:
        return rStr + 'Product}';
    }
  }

  /**
   * Destroys the instance of this class.
   */
  destroy(): void {

    delete this.id;
    delete this.operand;
    
  }
}


