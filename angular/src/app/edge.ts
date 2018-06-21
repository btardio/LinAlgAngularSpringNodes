import { LinAlgMatrix } from './matrix';
import { LinAlgFunction } from './matrix-function';
import { MultiDictionary as basMultiDict } from 'typescript-collections';



/**
 * A directed edge class connecting Matrices and Functions.
 */
export class LinAlgEdge {

  /**
   * An ID unique between LinAlgFunction, LinAlgMatrix and LinAlgEdge
   */
  private id: number;

  /**
   * Edge point i
   */
  private i: LinAlgFunction|LinAlgMatrix;

  /**
   * Edge point j
   */
  private j: LinAlgFunction|LinAlgMatrix;

  /**
   * Instantiates an edge with an id and i (LinAlgFunction|LinAlgMatrix ) and j (LinAlgFunction|LinAlgMatrix)
   */
  constructor( id: number, i: LinAlgFunction|LinAlgMatrix, j: LinAlgFunction|LinAlgMatrix ) {
    this.id = id;
    this.i = i;
    this.j = j;
  }

  /**
   * Returns the id.
   */
  getId(): number {
    return this.id;
  }

  getI(): number {
    return this.i.getId(); // .id;
  }

  getJ(): number {
    return this.j.getId(); // id;
  }

  /**
   * Returns the Matrix or Function associated with i
   */
  getIMF(): LinAlgMatrix|LinAlgFunction {
    return this.i;
  }

  /**
   * Returns the Matrix or Function associated with j
   */
  getJMF(): LinAlgMatrix|LinAlgFunction {
    return this.j;
  }

  /**
   * Returns the Matrix regardless of whether it is i or j
   */
  getMatrixOfIJ(): LinAlgMatrix {
    if ( this.i instanceof LinAlgMatrix ) {
      return this.i;
    }
    else if ( this.j instanceof LinAlgMatrix ) {
      return this.j;
    }
    else { throw Error('Matrix type not found in Edge.i or Edge.j.'); }
  }

  /**
   * Returns the Function regardless of whether it is i or j
   */
  getFunctionOfIJ(): LinAlgFunction {
      if ( this.i instanceof LinAlgFunction ) {
        return this.i;
      }
      else if ( this.j instanceof LinAlgFunction ) {
        return this.j;
      }
      else { throw Error('Function type not found in Edge.i or Edge.j.'); }
  }

  /**
   * Swaps i, j
   */
  swapIJ(): void {
    const v: LinAlgFunction|LinAlgMatrix = this.i;
    this.i = this.j;
    this.j = v;
  }

  /**
   * Returns true if Matrix/Function is at either end.
   */
  contains(v: LinAlgFunction|LinAlgMatrix): boolean {
    if ( this.i === v ) { return true; }
    if ( this.j === v ) { return true; }
    return false;
  }

  /**
   * Returns true/false depending on the direction
   */
  isPointedAtFunction() {
    if ( this.j instanceof LinAlgFunction) { return true; } else { return false; }
  }

  /**
   * Returns true/false depending on the direction
   */
  isPointedAtMatrix() {
    if ( this.j instanceof LinAlgMatrix ) { return true; } else { return false; }
  }

  /**
   * Returns true/false if both v, t are either or i, j
   */
  containsInAnyOrder(v: LinAlgFunction|LinAlgMatrix, t: LinAlgFunction|LinAlgMatrix): boolean {
    if ( ( this.i === v && this.j === t ) || ( this.j === v && this.i === t) ) {
      return true;
    }
    return false;
  }

  /**
   * Returns the string representation of this class. It is important to
   * leave this unique as it is used in typescript-collections compare.
   * The second half of the statement is not used in the event that an
   * edge was swapped.
   */
  toString(): string {
    return '{class:Edge,id:' + this.id.toString() + '}'; //  + ',i:' + this.i.getId() + ',j:' + this.j.getId() + '}';
  }

}

