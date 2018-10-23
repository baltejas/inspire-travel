import { Component, OnInit } from '@angular/core';
import { MONGOLAB_BASE_URL, MONGOLAB_API_KEY } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mongolab',
  templateUrl: './mongolab.component.html',
  styleUrls: ['./mongolab.component.css']
})
export class MongolabComponent implements OnInit {
  items: any;
  aURL: string = MONGOLAB_BASE_URL + 'shopping-list?apiKey=' + MONGOLAB_API_KEY;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.aURL).subscribe((data: any) => {
      this.items = data;
    });
  }
  
  addItem(name, quantity) {
    this.http.post(this.aURL, {name: name, quantity: quantity}).subscribe((data: any) => {
      this.ngOnInit();
    });
  }

}
