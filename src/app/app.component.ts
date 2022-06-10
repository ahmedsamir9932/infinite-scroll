import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, scan } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular Material Select Infinite Scroll';
  total = 4190;
  // data = Array.from({length: this.total}).map((_, i) => `Option ${i}`);
  data = [];
  limit = 10;
  end = ''
  offset = 1;
  options = new BehaviorSubject<any[]>([]);
  options$: Observable<any[]>;

  constructor(private http: HttpClient) {
      this.options$ = this.options.asObservable().pipe(
          scan((acc: any, curr: any) => {
              return [...acc, ...curr];
          }, [])
      );
  }

  ngOnInit() {
      this.getNextBatch();
  }

  getNextBatch() {
    this.getItems(this.offset, this.limit)
    // const result = this.data.slice(this.offset, this.offset + this.limit);
    // this.options.next(result);
    // this.offset++;
  }
  
  getItems(offset: number, limit: number) {
    this.http.get('http://gl.ttechapps.info/api/GetItemsDropDown', {params: new HttpParams()
    .set('Name', '').set('PageNumber', offset).set('PageSize', limit)}
    ).subscribe((res: any) => {
      console.log(res);
      this.data = res.data;
      console.log('data', this.data);
      this.options.next(this.data);
      this.offset++;
      this.end = res.note
    })
  }
}
