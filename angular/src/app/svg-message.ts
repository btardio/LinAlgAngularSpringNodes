import { MorF } from './mor-f.enum';

export class SvgMessage {

  private id: number;
  private morf: MorF;
  private element: any;

  constructor( id: number, morf: string, element: any ) {

    this.id = id;

    this.element = element;

    if ( morf === 'matrix') {
      this.morf = MorF.Matrix;
    }
    else if ( morf === 'function') {
      this.morf = MorF.Function;
    }
    else {
      throw Error('Attempting to add an unknown node type to selected container.');
    }

  }

  getElement ( ): any {
    return this.element;
  }

  getId ( ): number {
    return this.id;
  }

  toString(): string {
    return 'Id: ' + this.id + ' MorF: ' + this.morf;
  }


  getMorf ( ): MorF {
    return this.morf;
  }

}
