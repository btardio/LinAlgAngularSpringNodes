import { LinAlgEdge } from './edge';
import { LinAlgFunction } from './matrix-function';
import { LinAlgMatrix } from './matrix';
import { Set as basSet, BSTreeKV } from 'typescript-collections';
import { MultiDictionary as basMultiDict } from 'typescript-collections';
import { Bag as basBag } from 'typescript-collections';

type K = {
    key: number;
};

type Vm = K & {
    data: LinAlgMatrix;
};

type Vf = K & {
    data: LinAlgFunction;
};

/**
 * References to LinAlgMatrices, LinAlgFunctions, LinAlgEdges are stored in this
 * class.
 */
export class MatFuncContainer {

  /**
   * A binary search tree that holds instances of matrices.
   */
  private matrices: BSTreeKV< K, Vm >;

  /**
   * A binary search tree that holds instances of functions.
   */
  private functions: BSTreeKV< K, Vf >;

  /**
   * A dictionary whose values are arrays, storing IDs of LinAlgFunctions and LinAlgMatrices.
   * Edges are inserted into the dictionary for both directions, IJ and JI, creating a bi-directional
   * mapping of ids.
   */
  private edgesDict: basMultiDict<number, number>;

  /**
   * Instances of edges are stored in a bag. Could this be a set?
   */
  private edges: basBag<LinAlgEdge>;

  /**
   * Comparator function for the BSTree
   */
  compare(a: K, b: K) {
      if (a.key > b.key) {
          return 1;
      } else if (a.key < b.key) {
          return -1;
      } else { // a.key === b.key
          return 0;
      }
  }

  /**
   * Initialization of BST, Dict and Bag.
   */
  constructor() {
    this.matrices = new BSTreeKV( this.compare );
    this.functions = new BSTreeKV( this.compare );
    this.edgesDict = new basMultiDict<number, number>();
    this.edges = new basBag<LinAlgEdge>();
  }

  /**
   * Return the number of matrices.
   */
  getMatricesLength(): number {
    return this.matrices.size();
  }

  /**
   * Return the number of functions.
   */
  getFunctionsLength(): number {
    return this.functions.size();
  }

  /**
   * Given an ID, return an instance of LinAlgMatrix.
   */
  getMatrixWithId( n: number ): LinAlgMatrix {

    const mk: K = {key: n};

    const vm: Vm = this.matrices.search( mk );

    if ( vm === null || vm === undefined ) {
      throw Error('Matrix not found.');
    }
    else {
      return vm.data;
    }
  }

  /**
   * Given an ID, return an instance of LinAlgFunction.
   */
  getFunctionWithId( n: number ): LinAlgFunction {

    const fk: K = {key: n};

    const vf: Vf = this.functions.search( fk );

    if ( vf === null || vf === undefined ) {
      throw Error('Function not found.');
    }
    else {
      return vf.data;
    }

  }

  /**
   * Return LinAlgMatrix array.
   */
  getMatricesAsArray(): Array<LinAlgMatrix> {

    const vms: Array<Vm> = this.matrices.toArray();
    const rarray: Array<LinAlgMatrix> = new Array<LinAlgMatrix>();

    for ( let i = 0; i < vms.length; i++ ) {
      rarray.push(vms[i].data);
    }

    return rarray;
  }

  /**
   * Return LinAlgFunction array.
   */
  getFunctionsAsArray(): Array<LinAlgFunction> {

    const vfs: Array<Vf> = this.functions.toArray();
    const rarray: Array<LinAlgFunction> = new Array<LinAlgFunction>();

    for ( let i = 0; i < vfs.length; i++ ) {
      rarray.push(vfs[i].data);
    }

    return rarray;
  }

  /**
   * Insert a new function.
   */
  addfunc( f: LinAlgFunction ): LinAlgFunction {

    const fadd: Vf = { key: f.getId(), data: f };

    this.functions.add(fadd);

    f.getEdges().forEach(edge => {
      this.addEdge(edge);
    } );

    return f;
  }

  /**
   * Insert a new matrix.
   */
  addmatrix( m: LinAlgMatrix ): LinAlgMatrix {

    const madd: Vm = { key: m.getId(), data: m };

    this.matrices.add(madd);

    m.getEdges().forEach(edge => {
      this.addEdge(edge);
    } );

    return m;
  }


  /**
   * Delete a matrix.
   */
  private delmatrix( m: LinAlgMatrix ): void {

    const mk: K = { key: m.getId() };

    if ( !this.matrices.remove ( mk ) ) {
      throw Error('Attempting to remove a matrix that is not in the set.');
    }

  }

  /**
   * Delete a function.
   */
  private delfunc( f: LinAlgFunction ): void {

    const fk: K = { key: f.getId() };

    if ( !this.functions.remove ( fk ) ) {
      throw Error('Attempting to remove a function that is not in the set.');
    }

  }

  /**
   * Return an edge given two IDs
   */
  getEdgeForTwoIds( a: number, b: number ): LinAlgEdge  {

    let rval: LinAlgEdge = null;

    this.edges.forEach( edge => {

      if ( ( edge.getI() === a && edge.getJ() === b) || ( edge.getJ() === a && edge.getI() === b ) ) {
        rval = edge;
      }

    });

    if ( rval === null ) {
      throw Error('Edge not found.');
    }

    return rval;

  }

  /**
   * Return a list of edges that are connected to a LinAlgFunction or LinAlgMatrix
   */
  getEdgesForNode( mf: LinAlgFunction | LinAlgMatrix ): Array<LinAlgEdge> {

    if ( mf.getId() === undefined || mf.getId() === null ) {
      throw Error('Matrix|Function does not have defined id.');
    }

    const edgeIds: Array<number> = this.edgesDict.getValue( mf.getId() );

    const edges: Array<LinAlgEdge> = new Array<LinAlgEdge>();

    edgeIds.forEach( id => {
      edges.push( this.getEdgeForTwoIds( id, mf.getId() ) );
    });

    return edges;

  }

  /**
   * Returns the bag of edges.
   */
  getEdges(): basBag<LinAlgEdge> {
    return this.edges;
  }

  /**
   * Add an edge to the bag and to the dict.
   */
  addEdge( edge: LinAlgEdge ): void {

    let hasIJ = false;
    let hasJI = false;
    let hasBag = false;

    // for every array of key(I) in edgesDict check the j to see if it matches edge
    this.edgesDict.getValue( edge.getI() ).forEach( j => {
      if ( j === edge.getJ() ) { hasIJ = true; }
    });

    // for every array of key(J) in edgesDict check the i to see if it matches edge
    this.edgesDict.getValue( edge.getJ() ).forEach( i => {
      if ( i === edge.getI() ) { hasJI = true; }
    });

    // check that edges contains the edge
    this.edges.forEach( e => {
      if ( e.containsInAnyOrder( edge.getJMF(), edge.getIMF() ) ) {
        hasBag = true;
      }
    });

    if ( !hasIJ && !hasJI && !hasBag ) {
      this.edgesDict.setValue( edge.getI(), edge.getJ() );
      this.edgesDict.setValue( edge.getJ(), edge.getI() );
      this.edges.add(edge);
    }
    else if ( hasIJ && hasJI && hasBag ) {
      throw Error('Trying to add an edge that is already in container.');
    }
    else {
      throw Error('Something has gone wrong with Container Class. hasIJ:' + hasIJ + ' hasJI:' + hasJI + ' hasBag:' + hasBag);
    }

  }

  /**
   * Adds an edge to a function.
   */
  modifyFunctionAddEdge( f: LinAlgFunction, e: LinAlgEdge ): void {
    f.addEdge(e);
  }

  /**
   * Adds an edge to a matrix.
   */
  modifyMatrixAddEdge( m: LinAlgMatrix, e: LinAlgEdge ): void {
    m.addEdge(e);
  }

  /**
   * Given an edge, finds and returns a function.
   */
  findFunctionWithEdge( edge: LinAlgEdge ): LinAlgFunction {
    let rval: LinAlgFunction = null;

    this.functions.forEach( f => {
      if ( f.data.hasEdge(edge) ) {
        rval = f.data;
      }
    });

    if ( rval === null ) {
      throw Error('No function found with edge.');
    }

    return rval;

  }

  /**
   * Prints the bag and dict to the console.
   */
  debugPrintBagDict() {

    this.edges.forEach( e => {
      console.log(e);
    });

    this.edgesDict.keys().forEach( k => {
      console.log('key: ' + k + ':');
      this.edgesDict.getValue(k).forEach( v => {
        console.log('        value:' + v);
      });
    });
  }

  /**
   * Removes an edge, refuses to remove the edge if it does not exist
   * in both the dict and the bag.
   * @returns  Returns a list of IDs that were removed following this operation.
   *           Length of the returned list is guaranteed to be one.
   */
  removeEdge( edge: LinAlgEdge ): basSet<number> {

    const removedIds: basSet<number> = new basSet<number>();

    const a: boolean = this.edges.remove(edge, 1);
    const b: boolean = this.edgesDict.remove(edge.getI(), edge.getJ());
    const c: boolean = this.edgesDict.remove(edge.getJ(), edge.getI());

    if ( !( a && b &&  c ) ) {
      throw Error('Error removing edge in Matrix-Func Container.');
    }

    removedIds.add(edge.getId());

    return removedIds;

  }

  /**
   * Removes a function and also removes the connected edges.
   *
   * @returns Returns a list of IDs that were removed following this operation.
   */
  removeFunctionWithEdges( f: LinAlgFunction ): basSet<number> {

    const edges: Array<LinAlgEdge> = this.getEdgesForNode(f);
    const removedIds: basSet<number> = new basSet<number>();

    edges.forEach( edge => {

      removedIds.union( this.removeEdge( edge ) );

      const connectedMatrix: LinAlgMatrix = edge.getMatrixOfIJ();

      connectedMatrix.removeEdgeConnectedToFunction( f );

    });
    this.delfunc( f );

    return removedIds;
  }

  /**
   * Removes a matrix and also removes the connected edges.
   *
   * @returns Returns a list of IDs that were removed following this operation.
   */
  removeMatrixWithEdges( m: LinAlgMatrix ): basSet<number> {

    const edges: Array<LinAlgEdge> = this.getEdgesForNode(m);
    const removedIds: basSet<number> = new basSet<number>();

    edges.forEach( edge => {

      removedIds.union( this.removeEdge( edge ) );

      const connectedFunction: LinAlgFunction = edge.getFunctionOfIJ();

      connectedFunction.removeEdgeConnectedToMatrix( m );

    });
    this.delmatrix( m );

    return removedIds;
  }

  /**
   * Set the selected boolean of all matrices to false.
   */
  setAllMatricesSelectedToFalse() {
    this.matrices.forEach( m => {
      m.data.setSelected(false);
    });
  }

  /**
   * Set the selected boolean of all functions to false.
   */
  setAllFunctionsSelectedToFalse() {
    this.functions.forEach( f => {
      f.data.setSelected(false);
    });
  }


  /**
   * Destroy the class instance.
   */
  destroy( ) {
    this.matrices.forEach( item => item.data.destroy() );
    this.matrices.clear();
    this.functions.forEach( item => item.data.destroy() );
    this.functions.clear();
  }

}
