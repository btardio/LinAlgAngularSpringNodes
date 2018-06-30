import { MorF } from './mor-f.enum';
import { SvgMessageType } from './svg-message-type.enum';

export class SvgMessage {

  private id: number;
  private morf: MorF;
  private element: any;
  private messageType: SvgMessageType;

  constructor( id: number, morf: string, element: any, msgType: SvgMessageType ) {

    this.id = id;

    this.messageType = msgType;

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

  getMessageType(): SvgMessageType {
    return this.messageType;
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
