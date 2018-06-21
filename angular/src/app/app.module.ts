import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HideShowService } from './hideshowservices.service';
import { HttpClientModule } from '@angular/common/http';
import { MathtoptoolbarComponent } from './mathtoptoolbar/mathtoptoolbar.component';
import { MathaddmatrixtoolbarComponent } from './mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';
import { MathaddfunctiontoolbarComponent } from './mathaddfunctiontoolbar/mathaddfunctiontoolbar.component';
import { RouterModule, Routes } from '@angular/router';
import { MathSvgNgZoneComponent } from './math-svg-ng-zone/math-svg-ng-zone.component';
import { MatrixHttpClientService } from './matrix-http-client.service';
import { MatrixService } from './matrix-service.service';
import { SvgRenderService } from './svg-render-service.service';
import { KatexModule } from 'ng-katex';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// const appRoutes: Routes = [
//  { path: '', component: MathtoptoolbarComponent },
//  { path: '', component: HeroListComponent },
// ];

@NgModule({
  declarations: [
    AppComponent,
    MathtoptoolbarComponent,
    MathaddmatrixtoolbarComponent,
    MathaddfunctiontoolbarComponent,
    MathSvgNgZoneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KatexModule,
    ClarityModule,
    BrowserAnimationsModule
    // MathtoptoolbarModule
    // MathtoptoolbarComponent,
    // MathaddmatrixtoolbarComponent,
    // MathaddfunctiontoolbarComponent
  ],
  providers: [MatrixService, HideShowService, SvgRenderService, MatrixHttpClientService ],
  bootstrap: [AppComponent,
              MathtoptoolbarComponent,
              MathaddmatrixtoolbarComponent,
              MathaddfunctiontoolbarComponent,
              MathSvgNgZoneComponent
              // TempngmodelComponent
            ]
})
export class AppModule { }








