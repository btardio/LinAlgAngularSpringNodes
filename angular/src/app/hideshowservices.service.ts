import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


/**
 * Service that maintains the tool bar visibility status.
 */
@Injectable({
  providedIn: 'root'
})
export class HideShowService {

  private hiddenmathaddmatrixtoolbar = true;
  private hiddenmathaddmatrixtoolbarSubj: Subject<boolean> = new Subject<boolean>();
  hiddenmathaddmatrixtoolbarObs$: Observable<boolean>;

  private hiddenmathaddfunctiontoolbar = true;
  private hiddenmathaddfunctiontoolbarSubj: Subject<boolean> = new Subject<boolean>();
  hiddenmathaddfunctiontoolbarObs$: Observable<boolean>;

  constructor( ) {
    this.hiddenmathaddfunctiontoolbarObs$ = this.hiddenmathaddfunctiontoolbarSubj.asObservable();
    this.hiddenmathaddmatrixtoolbarObs$ = this.hiddenmathaddmatrixtoolbarSubj.asObservable();
  }

  swapHiddenmathaddmatrixtoolbar( ): boolean {
    this.hiddenmathaddmatrixtoolbar = !this.hiddenmathaddmatrixtoolbar;
    this.hiddenmathaddmatrixtoolbarSubj.next(this.hiddenmathaddmatrixtoolbar);
    return this.hiddenmathaddmatrixtoolbar;
  }

  swapHiddenmathaddfunctiontoolbar( ): boolean {
    this.hiddenmathaddfunctiontoolbar = !this.hiddenmathaddfunctiontoolbar;
    this.hiddenmathaddfunctiontoolbarSubj.next(this.hiddenmathaddfunctiontoolbar);
    return this.hiddenmathaddfunctiontoolbar;
  }

}
