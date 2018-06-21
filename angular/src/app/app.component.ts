import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { MathJax } from 'mathjax';
import { catchError } from 'rxjs/operators';
// import { MathtoptoolbarComponent } from './mathtoptoolbar/mathtoptoolbar.component';
// import { MathaddmatrixtoolbarComponent } from './mathaddmatrixtoolbar/mathaddmatrixtoolbar.component';

declare var MathJax: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  // greeting = { content: 'default content', id: '-1' };
  hub = null;
  returnv = null;
  // {id: 0, greeting: 'defaultgreeting'};

  // private urlstr = 'http://127.0.0.1:8080';

  ngOnInit() {

//    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'mathjaxp']);

  }


  constructor(private http: HttpClient) {
    // http.get( this.urlstr + '/resource').subscribe(data => { console.log(data); });

//    http.get( 'resource').subscribe(data => this.greeting = { content: data['content'], id: data['id'] } );
    //http.get( 'resource').subscribe(data => { console.log(data); });
    // this.greeting = this.returnv;
    // this.hub = new MathJax.Hub();
    // this.http.post<number>('resource', {'matrix':'[[1,1],[1,1]]'}); // add error checking
    // console.log('asd');
    //this.httpPost( '/resource', { 'matrix': '[[1,1],[1,1]]' } );
  }

}
