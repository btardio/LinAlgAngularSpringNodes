import { LinAlgEdge } from './edge';
import { Injectable } from '@angular/core';
import { MatFuncContainer } from './matrix-func-container';
import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { MatrixHttpClientService } from './matrix-http-client.service';
import { Subject, Observable } from 'rxjs';
import { Dictionary as basDictionary } from 'typescript-collections';
import { SelectedNodes } from './selected-nodes';
import { HttpClient } from '@angular/common/http';
import { Set as basSet } from 'typescript-collections';
import { BSTree } from 'typescript-collections';
import { LinkedList as basLinkedList } from 'typescript-collections';
import { Bag as basBag, BSTreeKV } from 'typescript-collections';

//
// TODO
//  remove unique id whenever removing edges
//  rename Function class to LinAlgFunction b/c Function is reserved keyword
//  make class members private
//  rename files
//  dagreD3 should use webpack?
//  edit matrix
//  matrix should have ready boolean that determines if previous post calls have returned or else it will have inaccurate result
//  add matrix edge recalculates the function
//  change function type
//  include other operands *, -, 
//  with only 1 matrix selected, swap direction should move matrix to other side of a function without having function selected
//  ...
//  build more tests from console.log(springPost); in calculateTests.spec.ts
//
// README
//  node.js serve: ng serve --proxy-config ./proxy.conf.json
//
//  create documentation: ./node_modules/typedoc/bin/typedoc --module commonjs --out ./documentation/ ./src
//                        ./node_modules/typedoc/bin/typedoc --options ./typedoc.js ./src
//  
//  removed check-else from tslint
//      "one-line": [
//    true,
//    "check-open-brace",
//    "check-catch",
//    "check-else",
//    "check-whitespace"
//  ],
//

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  /**
   * Contains all references to instances of LinAlgFunction, LinAlgMatrix, LinAlgEdge
   */
  private containerMatFunc: MatFuncContainer;

  /**
   * Triggered if the contents of the container change, ie: if a matrix is added or
   * removed, if an edge is changed. Anything that would affect the rendering of the
   * svg and would require a re-rendering.
   */
  private sbjContainerChanged: Subject<null> = new Subject<null>();
  containerChanged$: Observable<null> = this.sbjContainerChanged.asObservable();

  /**
   * Triggered if an html element changes, ie: a user toggles the select button for
   * a matrix. This is triggered for events that would not require an svg re-render
   * but could require html elements, such as the visibility of another html element,
   * to change.
   */
  private sbjSelectedChanged: Subject<null> = new Subject<null>();
  selectedChanged$: Observable<null> = this.sbjSelectedChanged.asObservable();

  // private sbjSelectedMatricesChanged: Subject<MatrixService> = new Subject<MatrixService>();
  // selectedMatricesChanged$: Observable<MatrixService> = this.sbjSelectedMatricesChanged.asObservable();

  // private sbjSelectedFunctionsChanged: Subject<MatrixService> = new Subject<MatrixService>();
  // selectedFunctionsChanged$: Observable<MatrixService> = this.sbjSelectedFunctionsChanged.asObservable();

  /**
   * BSTree of available unique IDs for LinAlgFunction, LinAlgMatrix, LinAlgEdge
   */
  private availableids: BSTree<number>;

  /**
   * End matrices in the graph, matrices with no inputs.
   */
  endMatrices: basSet<LinAlgMatrix>;

  /**
   * Holds the currently selected nodes.
   */
  private selected: SelectedNodes;

  /**
   * A counter that increments by 1 for every added matrix, never decrements from erase
   */
  private matrixCounter = 0;

  /**
   * Injects HttpClient service.
   */
  constructor( private matrixHttpClient: MatrixHttpClientService ) {

    this.containerMatFunc = new MatFuncContainer;

    this.availableids = new BSTree();

    this.selected = new SelectedNodes();

    matrixHttpClient.postReturned$.subscribe( somenullvar => { this.containerChanged(); } );

    this.endMatrices = new basSet<LinAlgMatrix>();

  }

  /**
   * Remove the unique Id from the list of IDs in use, freeing up the ID for future use.
   * @param n     The id to remove.
   */
  removeUniqueId( n: number ): void {
    if ( !this.availableids.remove( n ) ) { throw Error('Trying to remove an id that does not exist.'); }
  }

  /**
   * Returns a unique id for use by LinAlgFunction, Edge, Matrix.
   * @returns The unique id.
   */
  getPushUniqueId(): number {
    let found = false;
    let id = 0;
    while ( !found ) {

      if ( !this.availableids.contains(id) ) {
        found = true;
      }
      else {
        id += 1;
      }
    }

    this.availableids.add(id);

    return id;
  }

  /**
   * Returns the current count of the matrices that have been added, always increments, erase never decrements this counter
   */
  getMatrixCounter(): number {
    this.matrixCounter++;
    return this.matrixCounter;
  }

  /**
   * Emits the container changed signal.
   */
  containerChanged(): void {
    // this.matrixContainerChangedBoolean = !this.matrixContainerChangedBoolean;

    this.sbjContainerChanged.next( null );
  }

  /**
   * Calculates the nodes in the graph.
   */
  clickCalc() {

    this.getMatrices().forEach( m => {

      if ( m.isTopEndMatrix() && !m.isBottomEndMatrix() ) {

        m.calc(this.matrixHttpClient).subscribe(observable => { this.containerChanged(); });
      }
    });
  }

  getSbjSelectedChanged(): Subject<null> {
    return this.sbjSelectedChanged;
  }

  getMatricesWithoutOutputs(): basSet<LinAlgMatrix> {

    const rmatrices: basSet<LinAlgMatrix> = new basSet<LinAlgMatrix>();

    this.getMatrices().forEach( m => {
      if ( m.isTopEndMatrix() /* && !m.isBottomEndMatrix() */ ) {
        rmatrices.add( m );
      }
    });

    return rmatrices;
  }

  getFunctionsWithoutOutputs(): basSet<LinAlgFunction> {

    const rfunctions: basSet<LinAlgFunction> = new basSet<LinAlgFunction>();

    this.getFunctions().forEach( f => {
      if ( f.isTopEndFunction() /* && !f.isBottomEndFunction() */ ) {
        rfunctions.add( f );
      }
    });

    return rfunctions;

  }
  /**
   * Returns an underlying Container class that stores Matrices, Functions Edges.
   */
  getMatFuncContainer(): MatFuncContainer {
    return this.containerMatFunc;
  }

  /**
   * Returns a list of the IDs of the matrices that are selected.
   */
  getSelectedMatricesAsLinkedList(): basLinkedList<number> {
    return this.selected.getSelectedMatricesAsLinkedList();
  }

  /**
   * Returns a list of the ids of the functions that are selected.
   */
  getSelectedFunctionsAsLinkedList(): basLinkedList<number> {
    return this.selected.getSelectedFunctionsAsLinkedList();
  }

  /**
   * Returns a list of the ids of the matrices that are selected.
   */
  getSelectedMatricesAsArray(): Array<number> {
    return this.selected.getSelectedMatricesAsArray();
  }

  /**
   * Returns a list of the ids of the functions that are selected.
   */
  getSelectedFunctionsAsArray(): Array<number> {
    return this.selected.getSelectedFunctionsAsArray();
  }

  /**
   * Clears all selected matrices and functions.
   */
  clearSelectedAll(): void {
    this.containerMatFunc.setAllMatricesSelectedToFalse();
    this.containerMatFunc.setAllFunctionsSelectedToFalse();
    this.selected.clearSelectedAll();
    this.sbjSelectedChanged.next();

  }

  /**
   * Clears all selected matrices.
   */
  clearSelectedMatrices(): void {
    this.containerMatFunc.setAllMatricesSelectedToFalse();
    this.selected.clearSelectedMatrices();
    this.sbjSelectedChanged.next();
  }

  /**
   * Clears all selected functions.
   */
  clearSelectedFunctions(): void {
    this.containerMatFunc.setAllFunctionsSelectedToFalse();
    this.selected.clearSelectedFunctions();
    this.sbjSelectedChanged.next();
  }

  /**
   * Returns the Matrix with the corresponding id
   */
  getMatrixWithId(m_id: number): LinAlgMatrix {
    return this.containerMatFunc.getMatrixWithId(m_id);
  }

  /**
   * Returns the Function with the corresponding id
   */
  getFunctionWithId(f_id: number): LinAlgFunction {
    return this.containerMatFunc.getFunctionWithId(f_id);
  }

  /**
   * Add the id to the list of selected matrices.
   */
  addSelectedMatrix(m_id: number): void {
    this.selected.pushMatrix(m_id);
    this.getMatrixWithId(m_id).setSelected(true);
    this.sbjSelectedChanged.next();
  }

  /**
   * Remove the selected matrix id from the list of selected matrices.
   */
  removeSelectedMatrix(m_id: number): void {
    this.selected.removeMatrix(m_id);
    this.getMatrixWithId(m_id).setSelected(false);
    this.sbjSelectedChanged.next();
  }

  /**
   * Add the id to the list of selected functions.
   */
  addSelectedFunction(f_id: number): void {
    this.selected.pushFunction(f_id);
    this.getFunctionWithId(f_id).setSelected(true);
    this.sbjSelectedChanged.next();
  }

  /**
   * Remove the selected function id from the list of selected function.
   */
  removeSelectedFunction(f_id: number): void {
    this.selected.removeFunction(f_id);
    this.getFunctionWithId(f_id).setSelected(false);
    this.sbjSelectedChanged.next();
  }

  /**
   * Returns all edges that are referenced.
   * @returns typescript-collections basBag<Edge> containing the edges.
   */
  getEdges(): basBag<LinAlgEdge> {
    return this.containerMatFunc.getEdges();
  }

  /**
   * Return a list of referenced matrices.
   */
  getMatrices(): Array<LinAlgMatrix> {
    return this.containerMatFunc.getMatricesAsArray();
  }

  /**
   * Returns a list of referenced functions.
   */
  getFunctions(): Array<LinAlgFunction> {
    return this.containerMatFunc.getFunctionsAsArray();
  }

  /**
   * Order selected matrices ( list of numbers ) per their orderCount
   */
  orderSelectedMatrices( matrices: basLinkedList<number> ): basLinkedList<LinAlgMatrix> {

    type K = null & {
        key: number;
    };

    type Vm = K & {
        data: LinAlgMatrix;
    };

    function compare(a: K, b: K) {
      if (a.key > b.key) {
          return 1;
      } else if (a.key < b.key) {
          return -1;
      } else { // a.key === b.key
          return 0;
      }
    }

    let orderedSelectedMatrices: BSTreeKV<K, Vm> = new BSTreeKV( compare );

    matrices.forEach( mid => {
      const matrix: LinAlgMatrix = this.getMatrixWithId(mid);
      const madd: Vm = { key: matrix.getOrderCount(), data: matrix };
      orderedSelectedMatrices.add( madd );
    });

    const rlist: basLinkedList<LinAlgMatrix> = new basLinkedList<LinAlgMatrix>();

    orderedSelectedMatrices.toArray().forEach( m => { rlist.add( m.data ); });

    // clean up a little
    orderedSelectedMatrices.clear();
    orderedSelectedMatrices = null;

    return rlist;
  }


  /**
   * Internal: Create a result matrix for a newly created function.
   */
  private makeResultMatrix( f: LinAlgFunction ): LinAlgMatrix {

      let matrixArray: Array<Array<number>> | Array<Array<Array<number>>>;

      let rval: LinAlgMatrix;

      this.clearSelectedAll();

      matrixArray = f.getZeroAccurateDimensionArray();


      if ( matrixArray[0][0] instanceof Array ) {

          // TODO decomposition

      }
      else if ( typeof matrixArray[0][0] === 'number') {

        const m: LinAlgMatrix = new LinAlgMatrix( <Array<Array<number>>> matrixArray );

        const edge: LinAlgEdge = new LinAlgEdge( this.getPushUniqueId(), f, m );

        rval = this.addMatrix( m );

        f.addEdge(edge);
        m.addEdge(edge);

      }

    return rval;

  }


  /**
   * Insert a new function into the MatFunc container, additionally creates a new matrix and
   * performs a calculation.
   */
  addFunction( f: LinAlgFunction ): Array<LinAlgFunction | LinAlgMatrix> {
    f.setId(this.getPushUniqueId());
    const rval: Array<LinAlgFunction | LinAlgMatrix> = new Array<LinAlgFunction | LinAlgMatrix>();

    const selectedMatrices: basLinkedList<LinAlgMatrix> = this.orderSelectedMatrices(this.selected.getSelectedMatricesAsLinkedList());

    if ( selectedMatrices.size() === 0 ) {
      rval.push(this.containerMatFunc.addfunc(f));
    }
    else {
      selectedMatrices.forEach( matrix => {
        const edge: LinAlgEdge = new LinAlgEdge( this.getPushUniqueId(), matrix, f );
        f.addEdge(edge);
        matrix.addEdge(edge);
      });

      rval.push(this.makeResultMatrix(f));
      rval.push(this.containerMatFunc.addfunc(f));

      // this.matrixHttpClient.calc(f);

    }

    // this.clearSelectedAll();

    // ///this.containerChanged();
    return rval;
  }

  /**
   * Delete the matrix from the MatFunc container and release the ID
   */
  deleteMatrix( m: LinAlgMatrix ): void {

    let removedIds: basSet<number>;

    this.removeUniqueId( m.getId() );

    removedIds = this.containerMatFunc.removeMatrixWithEdges( m );

    removedIds.forEach( id => { this.removeUniqueId( id ); } );

    m.destroy();

    // this.containerChanged();

  }

  /**
   * Delete the function from the MatFunc container and release the ID
   */
  deleteFunction( f: LinAlgFunction ): void {

    let removedIds: basSet<number>;

    this.removeUniqueId( f.getId() );

    removedIds = this.containerMatFunc.removeFunctionWithEdges( f );

    removedIds.forEach( id => { this.removeUniqueId( id ); } );

    f.destroy();

    // this.containerChanged();
  }

  /**
   * Delete the currently selected matrices.
   */
  deleteSelectedMatrices(): void {

    const matrices_ids: basLinkedList<number> = this.selected.getSelectedMatricesAsLinkedList();

    matrices_ids.forEach( matrix_id => { this.deleteMatrix( this.getMatrixWithId( matrix_id ) ); } );

    // this.clearSelectedMatrices();

  }

  /**
   * Delete the currently selected functions.
   */
  deleteSelectedFunctions(): void {

    const functions_ids: basLinkedList<number> = this.selected.getSelectedFunctionsAsLinkedList();

    functions_ids.forEach( function_id => { this.deleteFunction( this.getFunctionWithId( function_id ) ); } );

    // this.clearSelectedFunctions();

  }

  /**
   * Adds a matrix to the container. If another function is selected, attaches an edge with that function.
   */
  addMatrix( m: LinAlgMatrix ): LinAlgMatrix {

    m.setId ( this.getPushUniqueId() );

    m.setOrderCount( this.getMatrixCounter() );

    let rval: LinAlgMatrix;

    const selectedFunctions: basLinkedList<number> = this.selected.getSelectedFunctionsAsLinkedList();

    if ( selectedFunctions.size() === 0 ) {
      rval = this.containerMatFunc.addmatrix( m );
    }
    else if ( selectedFunctions.size() === 1 ) {

      const fId: number = selectedFunctions.first();

      const edge: LinAlgEdge = new LinAlgEdge( this.getPushUniqueId(), m, this.getFunctionWithId(fId) );
      m.addEdge(edge);
      this.getFunctionWithId(fId).addEdge(edge);

      rval = this.containerMatFunc.addmatrix( m );

      // signal that function fId changed
    }

    // this.clearSelectedAll();
    // ///this.containerChanged();
    return rval;

  }

  /**
   * Adds an edge between a LinAlgMatrix and LinAlgFunction.
   */
  clickAddEdge(): basSet<LinAlgEdge> {

    const addedEdges: basSet<LinAlgEdge> = new basSet<LinAlgEdge>();

    const m: basLinkedList<number> = this.selected.getSelectedMatricesAsLinkedList();
    const f: basLinkedList<number> = this.selected.getSelectedFunctionsAsLinkedList();

    if ( m.size() > 1 && f.size() > 1) {
      throw Error('Can only connect 1 function with many matrices or 1 matrix with many functions.');
    }

    if ( m.size() === 0 || f.size() === 0 ) {
      throw Error('Select at least 1 matrix and 1 function to connect.');
    }

    if ( f.size() === 1 ) { // handles case of f.size() === m.size() === 1

      m.forEach( mfe => {

        const e: LinAlgEdge = new LinAlgEdge( this.getPushUniqueId(),
                                  this.getMatrixWithId( mfe ),
                                  this.getFunctionWithId( f.first() ) );

        this.containerMatFunc.modifyFunctionAddEdge(this.getFunctionWithId(f.first()), e);
        this.containerMatFunc.modifyMatrixAddEdge(this.getMatrixWithId(mfe), e);
        this.containerMatFunc.addEdge(e);
        addedEdges.add(e);
      });

    }

    else if ( m.size() === 1 ) {

      f.forEach( ffe => {

        const e: LinAlgEdge = new LinAlgEdge( this.getPushUniqueId(),
                                  this.getMatrixWithId( m.first() ),
                                  this.getFunctionWithId( ffe ) );

        this.containerMatFunc.modifyFunctionAddEdge(this.getFunctionWithId(ffe), e);
        this.containerMatFunc.modifyMatrixAddEdge(this.getMatrixWithId(m.first()), e);
        this.containerMatFunc.addEdge(e);
        addedEdges.add(e);
      });


    }

    // this.containerChanged();

    return addedEdges;

  }

  /**
   * Swaps the direction of an edge.
   */
  clickSwapDirection() {

    const m: basLinkedList<number> = this.selected.getSelectedMatricesAsLinkedList();
    const f: basLinkedList<number> = this.selected.getSelectedFunctionsAsLinkedList();

    if ( m.size() !== 1 || f.size() !== 1) {
      throw Error('Can only swap edge direction between 1 matrix and 1 function.');
    }

    const edge: LinAlgEdge = this.containerMatFunc.getEdgeForTwoIds( m.first(), f.first() );

    edge.swapIJ();

    // this.containerChanged();
  }

  clickSwapOrder() {

    // get the selected matrices
    const m: basLinkedList<number> = this.selected.getSelectedMatricesAsLinkedList();
    const f: basLinkedList<number> = this.selected.getSelectedFunctionsAsLinkedList();

    // check that only two matrices and 0 functions are selected
    if ( m.size() !== 2 ) { throw Error('Can only swap order of two matrices.'); }
    if ( f.size() !== 0 ) { throw Error('Only the order of matrices can be swapped.'); }

    // get the id's of the two selected matrices
    const mone: LinAlgMatrix = this.getMatrixWithId( m.elementAtIndex(0) );
    const mtwo: LinAlgMatrix = this.getMatrixWithId( m.elementAtIndex(1) );

    // find a function or functions that intersect the two selected matrices
    const outputFunctions: basSet<LinAlgFunction> = mone.getOutputFunctionsAsSet();
    outputFunctions.intersection(mtwo.getOutputFunctionsAsSet());

    // for each common function swap the edge within the function - todo? swap edge order in matrix also?
    outputFunctions.forEach( ffe => {
      let edgeone: LinAlgEdge = null;
      let edgetwo: LinAlgEdge = null;
      ffe.getEdges().forEach( e => {
        if ( e.getMatrixOfIJ() === mone || e.getMatrixOfIJ() === mtwo) {

          if ( edgeone == null ) { edgeone = e; }
          else if ( edgetwo == null ) { edgetwo = e; }
          else { throw Error('Function has multiple edges to same matrix.'); }

        }
      });
      ffe.swapEdges( edgeone, edgetwo );
    });
  }

  /**
   * Selects all instances of LinAlgMatrix and LinAlgFunction
   */
  selectAll() {

    let allSelected = true;

    if ( allSelected && this.getMatrices().find( m => ( m.getSelected() === false ) ) ) { allSelected = false; }
    if ( allSelected && this.getFunctions().find( f => ( f.getSelected() === false ) ) ) { allSelected = false; }

    if ( !allSelected ) {

      this.getMatrices().forEach( matrix => {

        this.selected.pushMatrixIgnoreDuplicate(matrix.getId());
        matrix.setSelected(true);

      });

      this.getFunctions().forEach( afunction => {

        this.selected.pushFunctionIgnoreDuplicate( afunction.getId() );
        afunction.setSelected(true);

      });

    }
    else {

      this.selected.clearSelectedAll();

      this.getMatrices().forEach( matrix => {

        matrix.setSelected(false);

      });

      this.getFunctions().forEach( afunction => {

        afunction.setSelected(false);

      });
    }
  }
}




