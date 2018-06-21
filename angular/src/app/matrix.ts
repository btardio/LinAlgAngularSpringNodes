/// <reference path="../../node_modules/@types/katex/index.d.ts" />

import { LinAlgEdge } from './edge';
import { LinkedList as basLinkedList } from 'typescript-collections';
import { Set as basSet } from 'typescript-collections';
import { LinAlgFunction } from './matrix-function';
import { MatrixHttpClientService } from './matrix-http-client.service';
import { MatrixService } from './matrix-service.service';
import * as katexrender from 'katex';
import { Subject, Observable, Subscription } from 'rxjs';
import { Bag as basBag } from 'typescript-collections';

/**
 * A class representing a matrix.
 */
export class LinAlgMatrix {

  /**
   * An ID unique between LinAlgFunction, LinAlgMatrix and LinAlgEdge
   */
  private id: number;

  /**
   * The matrix array.
   */
  private matrix: Array<Array<number>>;

  /**
   * Describes whether the matrix is selected.
   */
  private selected: boolean;

  /**
   * Edges for this matrix.
   */
  private edges: basLinkedList<LinAlgEdge>;



  /**
   * Instantiates a matrix, setting the matrix and, if provided, the edges
   */
  constructor( m: Array<Array<number>>,
               edges?: basLinkedList<LinAlgEdge> ) {

    if ( m === null || m === undefined ) {
      throw Error( 'Can not instantiate a matrix with a null array.' );
    }

    this.matrix = m;
    this.selected = false;
    this.edges = new basLinkedList<LinAlgEdge>();

    
    if ( edges !== null && edges !== undefined ) {
      edges.forEach( edge => {
        this.edges.add(edge);
      });
    }

  }



  /**
   * Calculates results for this matrix, do not call directly, called from MatrixService
   */
  calc( matrixHttpClient: MatrixHttpClientService ): Observable<LinAlgMatrix> {

    return Observable.create(observer => {

        if ( !this.isBottomEndMatrix() ) {
          this.getInputFunctions().first().calc( matrixHttpClient ).subscribe( f => {
            observer.next(this);
            observer.complete();
          });
        }
        else {
          observer.next(this);
          observer.complete();
        }
    });
 }
  /**
   * Returns true if this matrix has no input from another function, if this matrix is an end matrix
   */
  isBottomEndMatrix(): boolean {

    const functions: basLinkedList<LinAlgFunction> = this.getInputFunctions();

    if ( functions.size() === 0 ) {

      return true;
    }

    return false;

  }

  isTopEndMatrix(): boolean {

    const functions: basLinkedList<LinAlgFunction> = this.getOutputFunctions();

    if ( functions.size() === 0 ) {
      return true;
    }

    return false;

  }

  /**
   * Returns the matrix
   */
  getMatrix(): Array<Array<number>> {

    return this.matrix;

  }

  /**
   * Sets the matrix
   */
  setMatrix( m: Array<Array<number>> ): void {

    this.matrix = m;

  }

  /**
   * Returns the edges of the matrix
   */
  getEdges(): basLinkedList<LinAlgEdge> {
    return this.edges;
  }

  /**
   * Returns true if this is an end node with no previous function, this is important for
   * determining calculations.
   */
  hasNoInput(): boolean {
    if ( this.getInputEdges().size() === 0 && this .getInputFunctions().size() === 0 ) {
      return true;
    }
    else if ( (this.getInputEdges().size() !== 0 && this .getInputFunctions().size() === 0 ) ||
              (this.getInputEdges().size() === 0 && this .getInputFunctions().size() !== 0 ) ) {
      throw Error('Error in inputs of matrix.');
    }
    else {
      return false;
    }
  }
  
  /**
   * Returns the edges that point to this matrix
   */
  getInputEdges(): basLinkedList<LinAlgEdge> {

    const redges: basLinkedList<LinAlgEdge> = new basLinkedList<LinAlgEdge>();

    this.edges.forEach( edge => {
      if ( edge.getJMF().getId() === this.id ) { redges.add(edge); }
    });

    return redges;
  }

  /**
   * Returns the edges that point away from this matrix
   */
  getOutputEdges(): basLinkedList<LinAlgEdge> {

    const redges: basLinkedList<LinAlgEdge> = new basLinkedList<LinAlgEdge>();

    this.edges.forEach( edge => {
      if ( edge.getIMF().getId() === this.id ) { redges.add(edge); }
    });

    return redges;
  }


  /**
   * Returns the functions that are outputs of this matrix. This is
   * determined by the direction of the edges.
   */
  getOutputFunctions(): basLinkedList<LinAlgFunction> {
    const moutputs: basLinkedList<LinAlgFunction> = new basLinkedList<LinAlgFunction>();

    this.edges.forEach( e => {

      if ( e.isPointedAtFunction() ) {
        moutputs.add(e.getFunctionOfIJ());
      }

    } );

    return moutputs;
  }

  /**
   * Returns the functions that are inputs of this matrix. This is determined by the
   * direction of the edges.
   */
  getInputFunctions(): basLinkedList<LinAlgFunction> {

    const minputs: basLinkedList<LinAlgFunction> = new basLinkedList<LinAlgFunction>();

    this.edges.forEach( e => {

      if ( e.isPointedAtMatrix() ) {
        minputs.add(e.getFunctionOfIJ());
      }

    });

    return minputs;
  }

  
  /**
   * Removes an edge connected from this matrix to a function. Removes the
   * edge locally, in the this.edges linked list.
   */
  removeEdgeConnectedToFunction( f: LinAlgFunction ) {

    let found = false;
    let e: LinAlgEdge = null;

    this.edges.forEach( edge => {

      if ( edge.getFunctionOfIJ() === f ) {

        if ( found ) { throw Error('Matrix has multiple edges connected to single Function.'); }

        found = true;

        e = edge;

      }

    });

    if ( !found ) {
      throw Error('Trying to remove an edge from a Matrix that does not exist.');
    }

    this.edges.remove(e);

  }

  /**
   * returns true/false whether this matrix is selected
   */
  getSelected(): boolean {
    return this.selected;
  }

  /**
   * Sets the selected boolean
   */
  setSelected(selected: boolean): void {

    this.selected = selected;

  }

  /**
   * Returns true/false if this matrix has the edge
   */
  hasEdge( edge: LinAlgEdge ): boolean {

    return this.edges.contains( edge );

  }

  /**
   * adds an edge to the local edges linked list
   */
  addEdge(edge: LinAlgEdge): void {

    if ( this.edges.contains(edge) ) {
      throw Error('Trying to add an edge to function that already exists.');
    }

    this.edges.add(edge);

  }

  /**
   * returns the matrix as an array
   */
  getMatrixAsArray(): Array<Array<number>> {

    return this.matrix;

  }

  /**
   * returns the id of the matrix
   */
  getId(): number {
    return this.id;
  }

  /**
   * sets the id of the matrix
   */
  setId( id: number ): void {
    this.id = id;
  }

  toMathJaxString(): string {

    let astr = '\\left(\\begin{matrix}';
    astr += '';
    for ( let i = 0; i < this.matrix.length; i++ ) {
      astr += '';
      for ( let j = 0; j < this.matrix[i].length; j++) {
        astr += this.matrix[i][j];
        if ( j < this.matrix[i].length - 1 ) {
          astr += '&';
        }
      }
      if ( i < this.matrix.length - 1 ) {
        astr += '\\\\';
      }
      else {
        astr += '\\';
      }
    }

    astr += 'end{matrix}\\right)';

    // return astr;
    return katexrender.renderToString(astr);
    // return katexrender.renderToString('\\left(\\begin{matrix}1&2&7\\\\6&8&9\\\\4&1&5\\end{matrix}\\right)');
  }

  /**
   * returns the string representation of the matrix
   */
  toString() {
    let astr = '{id:' + this.id + ',matrix:';

    astr += '[';
    for ( let i = 0; i < this.matrix.length; i++ ) {
      astr += '[';
      for ( let j = 0; j < this.matrix[i].length; j++) {
        astr += this.matrix[i][j];
        if ( j < this.matrix[i].length - 1 ) {
          astr += ',';
        }
      }
      astr += ']';
    }
    astr += ']';

    return '}' + astr;
  }

  /**
   * destroys the instance of this matrix class
   */
  destroy() {

    delete this.id;
    delete this.matrix;

  }


}











//    const functions: basLinkedList<LinAlgFunction> = this.getInputFunctions();
//
//    if ( functions.size() === 0 ) { this.current = true; this.calcComplete.next(null); }
//    else {
//      functions.forEach( f => {
//       f.calcComplete$.subscribe( somenullvar => { this.current = true; this.calcComplete.next(null); } );
//      });
//
//    }
