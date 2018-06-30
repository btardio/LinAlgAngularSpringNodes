import { LinAlgMatrix } from './matrix';
import { LinkedList as basLinkedList } from 'typescript-collections';

export class SelectedNodes {

  private selectedFunctions: basLinkedList<number>;
  private selectedMatrices: basLinkedList<number>;

  constructor() {

    this.selectedFunctions = new basLinkedList<number>();
    this.selectedMatrices = new basLinkedList<number>();

  }

  clearSelectedAll(): void {
    this.selectedFunctions.clear();
    this.selectedMatrices.clear();
  }

  clearSelectedMatrices(): void {
    this.selectedMatrices.clear();
  }

  clearSelectedFunctions(): void {
    this.selectedFunctions.clear();
  }


  getSelectedFunctionsAsArray(): Array<number> {
    return this.selectedFunctions.toArray();
  }

  getSelectedMatricesAsArray(): Array<number> {
    return this.selectedMatrices.toArray();
  }

  getSelectedFunctionsAsLinkedList(): basLinkedList<number> {
    return this.selectedFunctions;
  }

  getSelectedMatricesAsLinkedList(): basLinkedList<number> {
    return this.selectedMatrices;
  }

  pushFunction( n: number ): void {

    if ( n === undefined ) {
      throw Error('Attempting insertion of undefined.');
    }

    if ( this.selectedMatrices.contains( n ) ) {
      throw Error('Attempting insertion of duplicate items.');
    }

    if ( !this.selectedFunctions.add( n ) ) {
      throw Error('Attempting insertion of duplicate items.');
    }

  }

  pushMatrix( n: number ): void {

    if ( n === undefined ) {
      throw Error('Attempting insertion of undefined.');
    }

    if ( this.selectedFunctions.contains( n ) ) {
      throw Error('Attempting insertion of duplicate items.');
    }

    if ( !this.selectedMatrices.add( n ) ) {
      throw Error('Attempting insertion of duplicate items.');
    }

  }

  pushFunctionIgnoreDuplicate( n: number ): void {

    if ( n === undefined ) {
      throw Error('Attempting insertion of undefined.');
    }

    if ( this.selectedFunctions.contains( n ) ) {
      return;
    }

    this.selectedFunctions.add( n );

  }

  pushMatrixIgnoreDuplicate( n: number ): void {

    if ( n === undefined ) {
      throw Error('Attempting insertion of undefined.');
    }

    if ( this.selectedMatrices.contains( n ) ) {
      return;
    }
    this.selectedMatrices.add( n );


  }

  removeFunction( n: number ): void {

    if ( n === undefined ) {
      throw Error('Attempting to remove undefined.');
    }

    if ( !this.selectedFunctions.remove(n) ) {
      throw Error('Attempting to remove an item that does not exist.');
    }
  }

  removeMatrix( n: number ): void {

    if ( n === undefined ) {
      throw Error('Attempting to remove undefined.');
    }

    if ( !this.selectedMatrices.remove(n) ) {
      throw Error('Attempting to remove item with id ' + n + ' that does not exist.');
    }
  }

}
